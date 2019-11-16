interface String {
    normalizeSpace: () => String;
}

String.prototype.normalizeSpace = function() {
    return this.replace(/\s\s+/g, ' ').replace('\n', '').trim();
};
