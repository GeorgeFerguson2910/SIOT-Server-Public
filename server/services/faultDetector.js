// Helper: safely coerce to number or null
function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// Helper: get metrics for a device_id from the Map
function getMetrics(currentStateByDevice, deviceId) {
  const state = currentStateByDevice.get(deviceId);
  if (!state || !state.metrics) return {};
  return state.metrics;
}

export function detectFaults(currentStateByDevice) {
  // Map devices to roles (adjust if your IDs change)
  const reactorMetrics = getMetrics(
    currentStateByDevice,
    "plant_1_reactor_temp_node_1"
  );
  const loopMetrics = getMetrics(
    currentStateByDevice,
    "plant_1_heat_output_node_1"
  );
  const exhaustMetrics = getMetrics(
    currentStateByDevice,
    "plant_1_exhaust_node_1"
  );
  const bufferMetrics = getMetrics(
    currentStateByDevice,
    "plant_1_buffer_node_1"
  );

  // ---- key signals ----
  const T1 = num(reactorMetrics.temp_T1);
  const T2 = num(reactorMetrics.temp_T2);
  const T3 = num(reactorMetrics.temp_T3);
  const T4 = num(reactorMetrics.temp_T4);
  const T5 = num(reactorMetrics.temp_T5);

  const fore = num(loopMetrics.fore_flow_temp);
  const ret = num(loopMetrics.return_flow_temp);
  const flow = num(loopMetrics.flow_rate);
  const delta_t = num(loopMetrics.delta_t);

  const bufLow = num(bufferMetrics.buffer_lower_temp);
  const bufUp = num(bufferMetrics.buffer_upper_temp);

  const gasTemp = num(exhaustMetrics.gas_temp);
  const gasP = num(exhaustMetrics.gas_pressure);
  const fan = num(exhaustMetrics.fan_speed);
  const o2 = num(exhaustMetrics.o2_percent);

  const faults = {
    infeed_blocked: false,
    hx_failed: false,
    flue_blockage: false,
    fan_failed: false,
    power_loss: false,
    reactor_overtemp_runaway: false,
    air_leak_door_open: false,
    flow_pump_failed: false,
    sensor_o2_drift: false,
    sensor_pressure_drift: false,
    sensor_T5_stuck: false, // static, best-effort
    cyclone_blockage: false,
  };

  // helper for avg reactor temp
  const reactorTemps = [T1, T2, T3, T4, T5].filter((x) => x !== null);
  const avgReactor =
    reactorTemps.length > 0
      ? reactorTemps.reduce((a, b) => a + b, 0) / reactorTemps.length
      : null;

  // -------------------------------
  // 1) reactor_overtemp_runaway
  // Python: +3°C to all reactor temps, +2°C to T5, o2_percent -= 0.5,
  //         fore_flow_temp += 2.0
  // → very hot reactor (esp T5), low-ish O2, high fore temp
  // -------------------------------
  if (
    T5 !== null &&
    T5 > 700 && // main trigger (matches comment “T5 > 700”)
    o2 !== null &&
    o2 < 10 &&
    fore !== null &&
    fore > 80
  ) {
    faults.reactor_overtemp_runaway = true;
  }

  // -------------------------------
  // 2) flow_pump_failed
  // Python: flow_rate = 0, fore/return set to mean (delta_t ~ 0),
  //         buffer temps slowly fall.
  // → zero flow, tiny ∆T across HX
  // -------------------------------
  if (
    flow !== null &&
    flow < 0.05 &&
    delta_t !== null &&
    Math.abs(delta_t) < 1.0 &&
    avgReactor !== null &&
    avgReactor > 300 // reactor still reasonably hot
  ) {
    faults.flow_pump_failed = true;
  }

  // -------------------------------
  // 3) fan_failed
  // Python: fan_speed = 0, gas_pressure = -20, gas_temp -= 3,
  //         o2 up (around 0.5 per step)
  // → fan ~0, weak draft, low-ish gas temp, high-ish O2
  // -------------------------------
  if (
    fan !== null &&
    fan < 1 &&
    gasP !== null &&
    gasP > -40 &&
    gasP < 0 &&
    gasTemp !== null &&
    gasTemp < 250 &&
    o2 !== null &&
    o2 > 15
  ) {
    faults.fan_failed = true;
  }

  // -------------------------------
  // 4) flue_blockage
  // Python: gas_pressure = max(..., -50) (not very negative),
  //         fan_speed = last + 1 (ramps up), O2 jitter.
  // → high fan, but pressure not as negative as normal.
  // -------------------------------
  if (
    fan !== null &&
    fan > 25 &&
    gasP !== null &&
    gasP > -60 && // clamped to >= -50 in sim
    gasP < 10 &&
    gasTemp !== null &&
    gasTemp > 150
  ) {
    faults.flue_blockage = true;
  }

  // -------------------------------
  // 5) air_leak_door_open
  // Python: o2 += 4, fore_flow_temp -= 2, gas_pressure -= 100
  // → O2 very high, fore temp pulled down, pressure very negative.
  // -------------------------------
  if (
    o2 !== null &&
    o2 > 18 &&
    fore !== null &&
    fore < 80 &&
    gasP !== null &&
    gasP < -120 // strong negative draft due to leak
  ) {
    faults.air_leak_door_open = true;
  }

  // -------------------------------
  // 6) hx_failed
  // Python: buffer temps decay slowly; fore/return forced very close
  // (mean ± 0.1) → tiny ∆T while reactor can still be hot, buffers cold.
  // -------------------------------
  if (
    avgReactor !== null &&
    avgReactor > 500 &&
    bufLow !== null &&
    bufUp !== null &&
    bufLow < 50 &&
    bufUp < 55 &&
    delta_t !== null &&
    Math.abs(delta_t) < 2
  ) {
    faults.hx_failed = true;
  }

  // -------------------------------
  // 7) infeed_blocked
  // Python: reactor temps step down by 2°C from last baseline, buffer + flow
  //         temps -1°C, O2 += 0.5.
  // With no history here, approximate: reactor cooler than normal but
  // O2 elevated; buffers also relatively cool.
  // -------------------------------
  if (
    avgReactor !== null &&
    avgReactor < 400 &&
    avgReactor > 150 && // not fully cold
    o2 !== null &&
    o2 > 15 &&
    bufUp !== null &&
    bufUp < 70
  ) {
    faults.infeed_blocked = true;
  }

  // -------------------------------
  // 8) power_loss
  // Python: big -5°C hit everywhere each step, flow & fan trend to 0,
  //         gas_pressure = -50, gas_temp drops toward ambient, O2 to ~20.
  // → whole plant dying: low flow, low fan, cool gas, near-ambient O2.
  // -------------------------------
  if (
    fan !== null &&
    fan < 2 &&
    flow !== null &&
    flow < 0.1 &&
    gasTemp !== null &&
    gasTemp < 80 &&
    o2 !== null &&
    o2 > 18 &&
    bufLow !== null &&
    bufUp !== null &&
    bufLow < 60 &&
    bufUp < 60
  ) {
    faults.power_loss = true;
  }

  // -------------------------------
  // 9) cyclone_blockage
  // Python: gas_pressure = max(..., -150) (not super negative),
  //         gas_temp += 5, O2 jitter.
  // → hot gas + not-as-negative pressure.
  // -------------------------------
  if (
    gasP !== null &&
    gasP > -80 && // "less negative" than a strong draw
    gasTemp !== null &&
    gasTemp > 500 &&
    fan !== null &&
    fan > 10
  ) {
    faults.cyclone_blockage = true;
  }

  // -------------------------------
  // 10) sensor_o2_drift
  // Python: o2 += 3 bias, no other signal changes.
  // Approx: O2 unrealistically high for the thermal/flow condition,
  // but without pressure/flow pattern of air_leak or power_loss.
  // -------------------------------
  if (
    o2 !== null &&
    o2 > 19 &&
    gasTemp !== null &&
    gasTemp > 400 && // still hot reactor/gas
    !faults.air_leak_door_open &&
    !faults.power_loss
  ) {
    faults.sensor_o2_drift = true;
  }

  // -------------------------------
  // 11) sensor_pressure_drift
  // Python: gas_pressure += 300, then clamped [-1000, 100].
  // → pressure can go positive or near zero, which is weird.
  // -------------------------------
  if (gasP !== null && gasP > 20) {
    faults.sensor_pressure_drift = true;
  }

  // -------------------------------
  // 12) sensor_T5_stuck  (VERY approximate)
  if (
    T5 !== null &&
    avgReactor !== null &&
    avgReactor > 400 &&
    // if T5 is much lower than avg of other thermocouples, that's weird
    reactorTemps.length >= 3 &&
    Math.abs(T5 - avgReactor) > 150 &&
    !faults.reactor_overtemp_runaway
  ) {
    faults.sensor_T5_stuck = true;
  }

  return faults;
}
