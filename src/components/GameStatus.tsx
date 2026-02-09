
import { FaCheckCircle, FaPen, FaTimesCircle } from "react-icons/fa";
import GameStatusCard from "./GameStatusCard";


export default function GameStatus() {
    const statuses = [
        {
            title: "Published",
            count: 10,
            icon: <FaCheckCircle />,
            color: "bg-green-500",
        },
        {
            title: "Draft",
            count: 5,
            icon: <FaPen />,
            color: "bg-yellow-500",
        },
        {
            title: "Failed",
            count: 2,
            icon: <FaTimesCircle />,
            color: "bg-red-500",
        },
    ];

    return (
        <div className="flex gap-4 w-full justify-center">
            {statuses.map((s) => (
                <GameStatusCard
                    key={s.title}
                    title={s.title}
                    count={s.count}
                    icon={s.icon}
                    color={s.color}
                />
            ))}
        </div>
    );
}
