// Use for formating the result of set
export const setToString = (set: Set<string>) => {
    const array = Array.from(set);
    return `{${array.toString()}}`
}

