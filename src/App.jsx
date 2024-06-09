import logo from "./logo.svg";
import styles from "./App.module.css";
import { Match, Show, Switch, createSignal, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { TbPlugConnected } from "solid-icons/tb";
import { FaSolidNetworkWired } from "solid-icons/fa";
import { ImSpinner11 } from "solid-icons/im";
import { IoThumbsUpSharp } from "solid-icons/io";
import { FaSolidRocket } from "solid-icons/fa";
function App() {
  let commands = {
    "0x0": "Get",
    "0x1": "Get Version",
    "0x2": "Get ID",
    "0x11": "Read Memory",
    "0x21": "Go",
    "0x31": "Write Memory",
    "0x43": "Erase",
    "0x44": "Extended Erase",
    "0x50": "Special",
    "0x51": "Extended Special",
    "0x63": "Write Protect",
    "0x73": "Write Unprotect",
    "0x82": "Readout Protect",
    "0x92": "Readout Unprotect",
    "0xA1": "Get Checksum",
  };

  let devices = {
    "0x440": {
      name: "STM32F051xx",
      ram_start: "0x20001000",
      ram_end: "0x20002000",
      fl_start: "0x08000000",
      fl_end: "0x08010000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80B",
      mem_start: "0x1FFFEC00",
      mem_end: "0x1FFFF800",
    },
    "0x444": {
      name: "STM32F030/F031",
      ram_start: "0x20001000",
      ram_end: "0x20002000",
      fl_start: "0x08000000",
      fl_end: "0x08010000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80B",
      mem_start: "0x1FFFEC00",
      mem_end: "0x1FFFF800",
    },
    "0x447": {
      name: "STM32F071xx",
      ram_start: "0x20000000",
      ram_end: "0x20005000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80B",
      mem_start: "0x1FFFEC00",
      mem_end: "0x1FFFF800",
    },
    "0x448": {
      name: "STM32F072xx",
      ram_start: "0x20001800",
      ram_end: "0x20004000",
      fl_start: "0x08000000",
      fl_end: "0x08010000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80B",
      mem_start: "0x1FFFEC00",
      mem_end: "0x1FFFF800",
    },
    "0x412": {
      name: "Low-density",
      ram_start: "0x20000200",
      ram_end: "0x20002800",
      fl_start: "0x08000000",
      fl_end: "0x08008000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFF000",
      mem_end: "0x1FFFF800",
    },
    "0x410": {
      name: "Medium-density",
      ram_start: "0x20000200",
      ram_end: "0x20005000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFF000",
      mem_end: "0x1FFFF800",
    },
    "0x414": {
      name: "High-density",
      ram_start: "0x20000200",
      ram_end: "0x20010000",
      fl_start: "0x08000000",
      fl_end: "0x08080000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFF000",
      mem_end: "0x1FFFF800",
    },
    "0x420": {
      name: "Medium-density VL",
      ram_start: "0x20000200",
      ram_end: "0x20002000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFF000",
      mem_end: "0x1FFFF800",
    },
    "0x428": {
      name: "High-density VL",
      ram_start: "0x20000200",
      ram_end: "0x20008000",
      fl_start: "0x08000000",
      fl_end: "0x08080000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFF000",
      mem_end: "0x1FFFF800",
    },
    "0x418": {
      name: "Connectivity line",
      ram_start: "0x20001000",
      ram_end: "0x20010000",
      fl_start: "0x08000000",
      fl_end: "0x08040000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFB000",
      mem_end: "0x1FFFF800",
    },
    "0x430": {
      name: "XL-density",
      ram_start: "0x20000800",
      ram_end: "0x20018000",
      fl_start: "0x08000000",
      fl_end: "0x08100000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFE000",
      mem_end: "0x1FFFF800",
    },
    "0x411": {
      name: "STM32F2xx",
      ram_start: "0x20002000",
      ram_end: "0x20020000",
      fl_start: "0x08000000",
      fl_end: "0x08100000",
      fl_pps: 4,
      fl_ps: 16384,
      opt_start: "0x1FFFC000",
      opt_end: "0x1FFFC00F",
      mem_start: "0x1FFF0000",
      mem_end: "0x1FFF77DF",
    },
    "0x432": {
      name: "STM32F373/8",
      ram_start: "0x20001400",
      ram_end: "0x20008000",
      fl_start: "0x08000000",
      fl_end: "0x08040000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFD800",
      mem_end: "0x1FFFF800",
    },
    "0x422": {
      name: "F302xB/303xB/358",
      ram_start: "0x20001400",
      ram_end: "0x20010000",
      fl_start: "0x08000000",
      fl_end: "0x08040000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFD800",
      mem_end: "0x1FFFF800",
    },
    "0x439": {
      name: "STM32F302",
      ram_start: "0x20001800",
      ram_end: "0x20004000",
      fl_start: "0x08000000",
      fl_end: "0x08040000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFD800",
      mem_end: "0x1FFFF800",
    },
    "0x438": {
      name: "F303x4/334/328",
      ram_start: "0x20001800",
      ram_end: "0x20003000",
      fl_start: "0x08000000",
      fl_end: "0x08040000",
      fl_pps: 2,
      fl_ps: 2048,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFD800",
      mem_end: "0x1FFFF800",
    },
    "0x413": {
      name: "STM32F40/1",
      ram_start: "0x20002000",
      ram_end: "0x20020000",
      fl_start: "0x08000000",
      fl_end: "0x08100000",
      fl_pps: 4,
      fl_ps: 16384,
      opt_start: "0x1FFFC000",
      opt_end: "0x1FFFC00F",
      mem_start: "0x1FFF0000",
      mem_end: "0x1FFF77DF",
    },
    "0x419": {
      name: "STM32F427/37",
      ram_start: "0x20002000",
      ram_end: "0x20030000",
      fl_start: "0x08000000",
      fl_end: "0x08100000",
      fl_pps: 4,
      fl_ps: 16384,
      opt_start: "0x1FFFC000",
      opt_end: "0x1FFFC00F",
      mem_start: "0x1FFF0000",
      mem_end: "0x1FFF77FF",
    },
    "0x423": {
      name: "STM32F401xB(C)",
      ram_start: "0x20003000",
      ram_end: "0x20010000",
      fl_start: "0x08000000",
      fl_end: "0x08100000",
      fl_pps: 4,
      fl_ps: 16384,
      opt_start: "0x1FFFC000",
      opt_end: "0x1FFFC00F",
      mem_start: "0x1FFF0000",
      mem_end: "0x1FFF77FF",
    },
    "0x433": {
      name: "STM32F401xD(E)",
      ram_start: "0x20003000",
      ram_end: "0x20018000",
      fl_start: "0x08000000",
      fl_end: "0x08100000",
      fl_pps: 4,
      fl_ps: 16384,
      opt_start: "0x1FFFC000",
      opt_end: "0x1FFFC00F",
      mem_start: "0x1FFF0000",
      mem_end: "0x1FFF77FF",
    },
    "0x417": {
      name: "L05xxx/06xxx",
      ram_start: "0x20001000",
      ram_end: "0x20002000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 16,
      fl_ps: 256,
      opt_start: "0x1FF80000",
      opt_end: "0x1FF8000F",
      mem_start: "0x1FF00000",
      mem_end: "0x1FF01000",
    },
    "0x416": {
      name: "L1xxx6(8/B)",
      ram_start: "0x20000800",
      ram_end: "0x20004000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 16,
      fl_ps: 256,
      opt_start: "0x1FF80000",
      opt_end: "0x1FF8000F",
      mem_start: "0x1FF00000",
      mem_end: "0x1FF01000",
    },
    "0x429": {
      name: "L1xxx6(8/B)A",
      ram_start: "0x20001000",
      ram_end: "0x20008000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 16,
      fl_ps: 256,
      opt_start: "0x1FF80000",
      opt_end: "0x1FF8000F",
      mem_start: "0x1FF00000",
      mem_end: "0x1FF01000",
    },
    "0x427": {
      name: "L1xxxC",
      ram_start: "0x20001000",
      ram_end: "0x20008000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 16,
      fl_ps: 256,
      opt_start: "0x1FF80000",
      opt_end: "0x1FF8000F",
      mem_start: "0x1FF00000",
      mem_end: "0x1FF02000",
    },
    "0x436": {
      name: "L1xxxD",
      ram_start: "0x20001000",
      ram_end: "0x2000C000",
      fl_start: "0x08000000",
      fl_end: "0x08060000",
      fl_pps: 16,
      fl_ps: 256,
      opt_start: "0x1FF80000",
      opt_end: "0x1FF8000F",
      mem_start: "0x1FF00000",
      mem_end: "0x1FF02000",
    },
    "0x437": {
      name: "L1xxxE",
      ram_start: "0x20001000",
      ram_end: "0x20014000",
      fl_start: "0x08000000",
      fl_end: "0x08060000",
      fl_pps: 16,
      fl_ps: 256,
      opt_start: "0x1FF80000",
      opt_end: "0x1FF8000F",
      mem_start: "0x1FF00000",
      mem_end: "0x1FF02000",
    },
    "0x641": {
      name: "Medium_Density PL",
      ram_start: "0x20000200",
      ram_end: "0x00005000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 4,
      fl_ps: 1024,
      opt_start: "0x1FFFF800",
      opt_end: "0x1FFFF80F",
      mem_start: "0x1FFFF000",
      mem_end: "0x1FFFF800",
    },
    "0x9a8": {
      name: "STM32W-128K",
      ram_start: "0x20000200",
      ram_end: "0x20002000",
      fl_start: "0x08000000",
      fl_end: "0x08020000",
      fl_pps: 1,
      fl_ps: 1024,
      opt_start: 0,
      opt_end: 0,
      mem_start: 0,
      mem_end: 0,
    },
    "0x9b0": {
      name: "STM32W-256K",
      ram_start: "0x20000200",
      ram_end: "0x20004000",
      fl_start: "0x08000000",
      fl_end: "0x08040000",
      fl_pps: 1,
      fl_ps: 2048,
      opt_start: 0,
      opt_end: 0,
      mem_start: 0,
      mem_end: 0,
    },
  };

  let prom_with_timeout = (promise, time) => {
    return Promise.race([
      promise,
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Promise timed out."));
        }, time); // Adjust the timeout value as needed (in milliseconds)
      }),
    ]);
  };
  const NACK = 0x1f;
  const ACK = 0x79;
  let port;
  const [connected, setConnected] = createSignal(false);
  const [connecting, setConnecting] = createSignal(false);
  const [logs, setLogs] = createStore([]);

  const [deviceID, setDeviceID] = createSignal(null);
  const [protocol, setProtocol] = createSignal(null);
  const [availableCommands, setAvailableCommands] = createStore([]);

  const [acceptTerms, setAcceptTerms] = createSignal(false);

  const [file, setFile] = createSignal(null);

  onCleanup(async () => {
    if (port) await port.close();
    setConnected(false);
  });
  let connect = async () => {
    if (connecting()) return;
    setConnecting(true);
    setLogs([...logs, "Attempting to connect to the device..."]);
    if (port) {
      setLogs([...logs, "Closing existing port..."]);
      setConnected(false);
      try {
        await port.close();
      } catch (e) {}
    }
    setLogs([...logs, "Requesting port..."]);
    try {
      port = await navigator.serial.requestPort();
      await port.open({
        baudRate: 9600,
        parity: "even",
        stopBits: 1,
        dataBits: 8,
      });
    } catch (e) {
      setLogs([
        ...logs,
        "Failed to connect to STM-32. Make sure no other programs are using the serial port.",
      ]);
      setConnecting(false);
      return;
    }
    let writer, reader;
    try {
      writer = port.writable.getWriter();
      reader = port.readable.getReader();
      let arr = new Uint8Array([0x7f]);
      await writer.write(arr);
      const { value, done } = await prom_with_timeout(reader.read(), 500);
      writer.releaseLock();
      reader.releaseLock();
      if (value == ACK) {
        setLogs([...logs, "Connected to STM-32."]);
        setLogs([
          ...logs,
          "If you physically disconnect the connection, please refresh the page.",
        ]);
        setConnected(true);
      } else {
        throw new Error("Incorrect response.");
      }
    } catch (e) {
      if (writer) writer.releaseLock();
      if (reader) reader.releaseLock();
      await port.close();
      setConnected(false);
      setLogs([
        ...logs,
        "STM-32 responded incorrectly. Make sure it is in bootloader mode. Try re-powering the device.",
      ]);
      setConnecting(false);
      return;
    }
    try {
      writer = port.writable.getWriter();
      reader = port.readable.getReader();
      let arr = new Uint8Array([0x00, 0xff]);
      let gotten = false;
      let result;
      for (let i = 1; i <= 5; i++) {
        await writer.write(arr);
        const { value, done } = await prom_with_timeout(reader.read(), 500);
        if (value[0] == ACK) {
          gotten = true;
          result = value;
          setLogs([
            ...logs,
            "STM-32 responded to request for version and allowed commands.",
          ]);
          break;
        } else if (value[0] == NACK) {
          setLogs([
            ...logs,
            "STM-32 did not acknowledge request for version and allowed commands. Retrying...",
          ]);
        } else {
          setLogs([
            ...logs,
            "STM-32 responded incorrectly to request for version and allowed commands. Retrying...",
          ]);
        }
      }
      if (!gotten) {
        throw new Error("Failed to get version and allowed commands.");
      }
      writer.releaseLock();
      reader.releaseLock();
      let num_commands = result[1] + 1; //It says so in the docs
      let protocol = (result[2] / 10).toString();
      setLogs([...logs, "Protocol: " + protocol]);
      setProtocol(protocol);
      for (let i = 3; i < 3 + num_commands; i++) {
        setLogs([
          ...logs,
          "Command: " +
            commands["0x" + result[i].toString(16)] +
            " (0x" +
            result[i].toString(16) +
            ")",
        ]);
        setAvailableCommands([
          ...availableCommands,
          "0x" + result[i].toString(16),
        ]);
      }
    } catch (e) {
      if (writer) writer.releaseLock();
      if (reader) reader.releaseLock();
      setConnected(false);
      await port.close();
      setLogs([
        ...logs,
        "Failed to get version and allowed commands from STM-32. Make sure it is in bootloader mode. Try re-powering the device.",
      ]);
      setConnecting(false);
      return;
    }
    try {
      if (availableCommands.indexOf("0x2") == -1) {
        setLogs([...logs, "STM-32 does not support getting the chip ID."]);
        throw new Error("Chip ID not supported.");
      }
      writer = port.writable.getWriter();
      reader = port.readable.getReader();
      let arr = new Uint8Array([0x02, 0xfd]);
      let gotten = false;
      let result;
      for (let i = 1; i <= 5; i++) {
        await writer.write(arr);
        const { value, done } = await prom_with_timeout(reader.read(), 500);
        if (value[0] == ACK) {
          gotten = true;
          result = value;
          setLogs([...logs, "STM-32 responded to request for chip ID."]);
          break;
        } else if (value[0] == NACK) {
          setLogs([
            ...logs,
            "STM-32 did not acknowledge request for chip ID. Retrying...",
          ]);
        } else {
          setLogs([
            ...logs,
            "STM-32 responded incorrectly to request for chip ID. Retrying...",
          ]);
        }
      }
      if (!gotten) {
        throw new Error("Failed to get chip ID.");
      }
      writer.releaseLock();
      reader.releaseLock();
      let version = (result[2] * 16 * 16 + result[3]).toString(16);
      setLogs([...logs, "Chip ID: 0x" + version]);
      setDeviceID("0x" + version);
    } catch (e) {
      if (writer) writer.releaseLock();
      if (reader) reader.releaseLock();
      setConnected(false);
      await port.close();
      setLogs([
        ...logs,
        "Failed to get chip ID from STM-32. Make sure it is in bootloader mode. Try re-powering the device.",
      ]);
      setConnecting(false);
      return;
    }
    setConnecting(false);
  };
  let upload = async () => {
    if(connecting()) return;
    if(!connected()) return;
    if(!acceptTerms()) return;
    if(!file()) return;
    setConnecting(true);
    setLogs([...logs, "Attempting to upload binary..."]);
    let buffer = await file().arrayBuffer();
    let ui8Data = new Uint8Array(buffer);
    let writer, reader;
    setLogs([...logs, "Attempting to disable write protection..."]);
    try {
      writer = port.writable.getWriter();
      reader = port.readable.getReader();
      let arr = new Uint8Array([0x73, 0x8c]);
      let gotten = false;
      let result;
      for (let i = 1; i <= 5; i++) {
        await writer.write(arr);
        const { value, done } = await prom_with_timeout(reader.read(), 1000);
        console.log(value);
        if (value[0] == ACK && value[1] == ACK) {
          gotten = true;
          result = value;
          setLogs([
            ...logs,
            "STM-32 disabled write protection.",
          ]);
          break;
        } else if (value[0] == NACK) {
          setLogs([
            ...logs,
            "STM-32 did not acknowledge request to disable write protection. Retrying...",
          ]);
        } else {
          setLogs([
            ...logs,
            "STM-32 responded incorrectly to request to disable write protection. Retrying...",
          ]);
        }
      }
      if (!gotten) {
        throw new Error("Failed to disabled write protection.");
      }
      writer.releaseLock();
      reader.releaseLock();
    } catch (e) {
      if (writer) writer.releaseLock();
      if (reader) reader.releaseLock();
      setConnected(false);
      await port.close();
      setLogs([
        ...logs,
        "Failed to disabled write protection. Make sure it is in bootloader mode. Try re-powering the device.",
      ]);
      setConnecting(false);
      return;
    }
  };
  return (
    <div class="absolute bottom-0 left-0 right-0 top-0 bg-gradient-to-tr from-zinc-50 to-cyan-50 p-4 text-center">
      <div class="text-center text-3xl font-bold">STM-32 Serial Flash Tool</div>
      <Show
        when={"serial" in navigator}
        fallback={<div>This device does not support serial connections.</div>}
      >
        <Switch>
          <Match when={connecting()}>
            <button
              class="m-2 rounded-lg bg-gray-600 p-3 text-center text-xl font-bold text-white"
              onClick={[connect]}
              disabled
            >
              <div class="flex flex-row items-center gap-2">
                <ImSpinner11 />
                <span>Connecting...</span>
              </div>
            </button>
          </Match>
          <Match when={connected()}>
            <button
              class="m-2 rounded-lg bg-gray-900 p-3 text-center text-xl font-bold text-white"
              onClick={[connect]}
              disabled
            >
              <div class="flex flex-row items-center gap-2">
                <FaSolidNetworkWired />
                <span>Connected</span>
              </div>
            </button>
          </Match>
          <Match when={true}>
            <button
              class="m-2 rounded-lg bg-gray-600 p-3 text-center text-xl font-bold text-white"
              onClick={[connect]}
            >
              <div class="flex flex-row items-center gap-2">
                <TbPlugConnected />
                <span>Connect</span>
              </div>
            </button>
          </Match>
        </Switch>
        <div class="grid h-80 max-h-80 min-h-0 grid-flow-row grid-cols-3 gap-4">
          <div class="col-span-2 flex h-full min-h-0 flex-col">
            <div>Logs</div>
            <div class="min-w-0 flex-1 overflow-y-auto text-wrap border-2 border-black">
              <For each={logs}>
                {(log) => {
                  return <div>{log}</div>;
                }}
              </For>
            </div>
          </div>
          <div class="col-span-1 flex h-full min-h-0 flex-col">
            <div>Specs</div>
            <div class="min-w-0 flex-1 overflow-y-auto text-wrap border-2 border-black">
              <Show when={devices && devices[deviceID()]}>
                <div>Device ID: {deviceID()}</div>
                <div>Device Name: {devices[deviceID()].name}</div>
                <div>RAM Start: {devices[deviceID()].ram_start}</div>
                <div>RAM End: {devices[deviceID()].ram_end}</div>
                <div>Flash Start: {devices[deviceID()].fl_start}</div>
                <div>Flash End: {devices[deviceID()].fl_end}</div>
                <div>Flash Page Size: {devices[deviceID()].fl_ps}</div>
                <div>Flash Pages Per Sector: {devices[deviceID()].fl_pps}</div>
                <div>Option Byte Start: {devices[deviceID()].opt_start}</div>
                <div>Option Byte End: {devices[deviceID()].opt_end}</div>
                <div>Memory Start: {devices[deviceID()].mem_start}</div>
                <div>Memory End: {devices[deviceID()].mem_end}</div>
              </Show>
            </div>
          </div>
        </div>
        <Show when={devices && devices[deviceID()]}>
          <div class="m-6 rounded-lg border-0 bg-gradient-to-tr from-orange-300 to-yellow-200 p-4">
            <div class="text-xl font-bold">
              Now, make sure that the specs above are correct! Ensure the device
              name and the locations are accurate. While the specs provided are
              accurate to the best of my knowledge, I have not tested this on
              all devices.{" "}
              <a href="github.com" class="text-blue-800 underline">
                If there are any inaccuracies, please submit an issue here.
              </a>
            </div>
            <Show
              when={!acceptTerms()}
              fallback={<div>Yes, it is all ok!</div>}
            >
              <button
                class="m-2 rounded-lg bg-gray-600 p-3 text-center text-xl font-bold text-white"
                onClick={() => setAcceptTerms(true)}
              >
                <div class="flex flex-row items-center gap-2">
                  <IoThumbsUpSharp />
                  <span>All good!</span>
                </div>
              </button>
            </Show>
          </div>
          <Show when={acceptTerms()}>
            <div class="m-6 rounded-lg border-0 bg-gradient-to-tr from-cyan-200 to-sky-300 p-4">
              <div class="text-xl font-bold">
                Ok! Upload your file below to flash it onto your device. Make
                sure the serial connection has not been disrupted (loss of
                bluetooth/wired connection).
              </div>
              <input
                type="file"
                accept=".bin"
                class="m-4 rounded-lg bg-gray-600 bg-opacity-15 p-4"
                onChange={(event) => {
                  setFile(event.target.files[0]);
                }}
              />
            </div>
            <Show when={file()}>
              <button
                class="m-2 rounded-lg bg-gray-600 p-3 text-center text-xl font-bold text-white"
                onClick={() => upload()}
              >
                <div class="flex flex-row items-center gap-2">
                  <FaSolidRocket />
                  <span>Upload!</span>
                </div>
              </button>
            </Show>
          </Show>
        </Show>
      </Show>
    </div>
  );
}

export default App;
