interface String {
    normalizeSpace: () => String;
}

String.prototype.normalizeSpace = function() {
    return this
        .replace(/\n/g, ' ')
        .replace(/\s\s+/g, ' ').trim();
};
