export class Event {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class RenderderEvent extends Event {
  placement: string;

  constructor(name: string, placement: string) {
    super(name);
    this.placement = placement;
  }
}
