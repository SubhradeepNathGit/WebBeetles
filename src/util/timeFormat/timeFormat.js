export const formatToHHMMSS = (secMs) => {
    if (secMs === null || secMs === undefined) return "00:00:00";

    let totalSeconds = 0;

    // Case 1: "seconds:milliseconds"
    if (typeof secMs === "string" && secMs.includes(":")) {
        const [sec, ms] = secMs.split(":");
        totalSeconds = Number(sec) + Number(ms || 0) / 1000;
    }
    // Case 2: seconds.milliseconds OR seconds only
    else {
        totalSeconds = Number(secMs);
    }

    if (isNaN(totalSeconds)) return "00:00:00";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};


export const formatDateByHHAndDay = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
};