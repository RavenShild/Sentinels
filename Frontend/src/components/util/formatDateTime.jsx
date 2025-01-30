import { format, parseISO } from "date-fns";
import React from "react";

export function formatDate(dateString) {
    const date = parseISO(dateString); // Converte a string para um objeto de data
    const formattedDate = format(date, "dd/MM/yyyy"); // Formata a data para dd/MM/yyyy
    return formattedDate;
}

export function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
}