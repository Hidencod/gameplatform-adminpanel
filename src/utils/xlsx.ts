import type { Game } from "../types/game";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export function exportGamesToExcel(games: Game[]) {
    // Map data to a flat array for Excel
    const data = games.map(game => ({
        ID: game.id,
        Name: game.name,
        Category: game.category ?? "",
        "Created At": new Date(game.createdAt).toLocaleDateString(),
        "Play Count": game.playCount ?? 0,
        "Average Rating": game.averageRating?.toFixed(2) ?? "0.00"
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Games");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Save file
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "games.xlsx");
}
