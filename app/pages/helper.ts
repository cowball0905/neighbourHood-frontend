export const formatTime = (date:Date) => {
    const year = date.getFullYear().toString().padStart(2,'0');
    const month = date.getMonth().toString().padStart(2,'0');
    const day = date.getDay().toString().padStart(2,'0');
    const hour = date.getHours().toString().padStart(2,'0');
    const min = date.getMinutes().toString().padStart(2,'0');

    return `${day}/${month}/${year} ${hour}:${min}`
}