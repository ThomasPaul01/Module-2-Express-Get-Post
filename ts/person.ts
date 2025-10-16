class Person {
  life_points: number;

  constructor(life_points: number) {
    this.life_points = life_points;
  }

   hit(victim: Person): void {
    victim.life_points -= 10;
    }
    isDead(): boolean {
        return this.life_points <= 0;
    }
    get_life_points(): number {
        return this.life_points;
    }
}

class HealthPotion extends Person {
    was_used_by(person: Person): void {
        person.life_points += 10;
    }
}

class Inventory {
    items: string[];

    constructor() {
        this.items = [];
    }

    add_object(item: string): void {
        this.items.push(item);
    }

    get_objects(): string[] {
        return this.items;
    }
}






