import moment from "moment";
import { useEffect, useState } from "react";

export default function AppDateTime() {
          const [time, setTime] = useState(Date.now());
          useEffect(() => {
            const interval = setInterval(() => setTime(Date.now()), 1000);
            return () => {
              clearInterval(interval);
            };
          }, []);
          return (
            <div className="text-light sidebar-date" style={{ fontSize: 12 }}>
              {moment(time).format("DD MMM YYYY HH:mm:ss")}
            </div>
          )
        }