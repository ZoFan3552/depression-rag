import { Tooltip as RechartsTooltip } from "recharts";

// 给定一个十六进制颜色，转换为对比度最高的相反颜色
// 如果启用了"bw"，则强制使其为黑色/白色以标准化界面。
function invertColor(hex, bw) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // 将3位十六进制转换为6位
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("无效的十六进制颜色。");
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#FFFFFF" : "#000000";
    // : '#FFFFFF';
  }
  // 反转颜色分量
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // 用零填充并返回
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

export default function Tooltip({ legendColor, ...props }) {
  return (
    <RechartsTooltip
      wrapperStyle={{ outline: "none" }}
      isAnimationActive={false}
      cursor={{ fill: "#d1d5db", opacity: "0.15" }}
      position={{ y: 0 }}
      {...props}
      content={({ active, payload, label }) => {
        return active && payload ? (
          <div className="bg-blue-900/95 text-sm rounded-md border border-blue-300/20 shadow-lg">
            <div className="border-b border-blue-300/20 py-2 px-4">
              <p className="text-blue-100 font-medium">{label}</p>
            </div>
            <div className="space-y-1 py-2 px-4">
              {payload.map(({ value, name }, idx) => (
                <div
                  key={`id-${idx}`}
                  className="flex items-center justify-between space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className="shrink-0 h-3 w-3 border-blue-300 rounded-md rounded-full border-2 shadow-md"
                      style={{ backgroundColor: legendColor }}
                    />
                    <p
                      style={{
                        color: invertColor(legendColor, true),
                      }}
                      className="font-medium tabular-nums text-right whitespace-nowrap text-white"
                    >
                      {value}
                    </p>
                  </div>
                  <p
                    style={{
                      color: invertColor(legendColor, true),
                    }}
                    className="whitespace-nowrap font-normal text-blue-100"
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      }}
    />
  );
}
