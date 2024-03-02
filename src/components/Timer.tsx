import { useEffect, useMemo, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

interface TimerType {
  deadline: string;
}

export const Timer = (props: TimerType) => {
  const parsedDeadline = useMemo(
    () => Date.parse(props.deadline),
    [props.deadline]
  );
  const [time, setTime] = useState(parsedDeadline - Date.now());

  useEffect(() => {
    const interval = setInterval(
      () => setTime(parsedDeadline - Date.now()),
      1000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      <div className="flex gap-2">
        {Object.entries({
          Days: time / DAY,
          Hours: (time / HOUR) % 24,
          Mins: (time / MINUTE) % 60,
          Secs: (time / SECOND) % 60,
        }).map(([label, value]) => (
          <div
            key={label}
            className="box flex gap-2 flex-col items-center text-[#0D47A1]"
          >
            <p className="text-xl mt-1 text-[#0D47A1]">
              {`${Math.floor(value)}`.padStart(2, "0")}{" "}
            </p>
            <span className="text">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
