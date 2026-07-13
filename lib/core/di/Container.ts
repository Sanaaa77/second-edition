type Token = string | symbol;
type Factory<T> = (container: Container) => T;

export class Container {
  private static instance: Container;
  private services = new Map<Token, any>();
  private factories = new Map<Token, Factory<any>>();
  private singletons = new Map<Token, any>();

  private constructor() {}

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(token: Token, value: T): void {
    this.services.set(token, value);
  }

  public registerFactory<T>(token: Token, factory: Factory<T>): void {
    this.factories.set(token, factory);
  }

  public registerSingleton<T>(token: Token, factory: Factory<T>): void {
    this.registerFactory(token, (c) => {
      if (!this.singletons.has(token)) {
        this.singletons.set(token, factory(c));
      }
      return this.singletons.get(token);
    });
  }

  public resolve<T>(token: Token): T {
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    if (this.factories.has(token)) {
      return this.factories.get(token)!(this);
    }

    throw new Error(`Service not found for token: ${String(token)}`);
  }

  public clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }
}

export const container = Container.getInstance();
