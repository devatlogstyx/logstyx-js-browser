//@ts-check

const safeParse = (input) => {
    try {
        return input ? JSON.parse(input) : {};
    } catch {
        return {};
    }
}

const getOrSetSessionId = () => {
    const name = "logstyx_sid";
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];

    const newId = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

    document.cookie = `${name}=${newId}; path=/; SameSite=Strict`;

    return newId;
};

module.exports = {
    safeParse,
    getOrSetSessionId
}