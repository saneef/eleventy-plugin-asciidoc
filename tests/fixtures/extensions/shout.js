function shout() {
  const self = this;
  self.named("shout");
  self.onContext("paragraph");
  self.process(function (parent, reader) {
    const lines = reader.getLines().map((l) => l.toUpperCase());
    return self.createBlock(parent, "paragraph", lines);
  });
}

function register(registry) {
  if (typeof registry.register === "function") {
    registry.register(function () {
      this.block(shout);
    });
  } else if (typeof registry.block === "function") {
    registry.block(shout);
  }

  return registry;
}

module.exports = { register };
