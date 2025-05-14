//@ts-check

exports.safeParse = (input) => {
    try {
        return input ? JSON.parse(input) : {};
    } catch {
        return {};
    }
}
