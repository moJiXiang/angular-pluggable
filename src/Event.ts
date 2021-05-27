type BindData = { [k: string]: any };

export class Event {
  name: string;
  data?: BindData;

  constructor(name: string, data?: BindData) {
    this.name = name;

    if (data) {
      this.data = data;
    }
  }
}

export class RenderderEvent extends Event {
  placement: string;

  constructor(name: string, placement: string) {
    super(name);
    this.placement = placement;
  }
}
