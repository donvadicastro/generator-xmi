String.prototype.normalizeSpace = function() {
    return this.replace(/\s\s+/g, ' ').trim();
};