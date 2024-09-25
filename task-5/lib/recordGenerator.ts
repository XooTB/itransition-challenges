import {
	Faker,
	en,
	en_US,
	pl,
	de,
	fr,
	ru,
	de_AT,
	de_CH,
	fr_CA,
	fr_CH,
	fr_LU,
} from "@faker-js/faker";

type Region = "England" | "Poland" | "Germany" | "France";

export interface GeneratorOptions {
	region: Region;
	seed: number;
	pageNumber: number;
}

class RecordGenerator {
	private faker: Faker;
	private region: Region;
	private pageNumber: number;

	constructor(options: GeneratorOptions) {
		this.region = options.region;
		this.pageNumber = options.pageNumber;
		this.faker = new Faker({
			locale: this.getLocale(this.region),
		});
		this.faker.seed(this.calculateSeed(options.seed));
	}

	private getLocale(region: Region) {
		switch (region) {
			case "England":
				return en;
			case "Poland":
				return [pl, ru];
			case "Germany":
				return [de, en];
			case "France":
				return [fr, en];
		}
	}

	private calculateSeed(userSeed: number): number {
		return userSeed * this.pageNumber;
	}

	private formatPhoneNumber(): string {
		const formats = [
			this.faker.phone.number({ style: "international" }),
			this.faker.phone.number({ style: "national" }),
		];
		return this.faker.helpers.arrayElement(formats);
	}

	private formatAddress(): string {
		try {
			const formats = [
				`${this.faker.location.city()}, ${this.faker.location.street()}, ${this.faker.location.buildingNumber()}, Apt. ${this.faker.number.int({ min: 1, max: 100 })}`,
				`${this.faker.location.county()}, ${this.faker.location.city()}, ${this.faker.location.street()} ${this.faker.location.buildingNumber()}`,
				`Apt. ${this.faker.number.int({ min: 1, max: 100 })}, ${this.faker.location.buildingNumber()}, ${this.faker.location.street()}, ${this.faker.location.city()}, ${this.faker.location.zipCode()}, ${this.region}`,
				`${this.faker.location.city()}, ${this.faker.location.street()}, ${this.faker.location.buildingNumber()}, ${this.faker.location.zipCode()}, ${this.region}`,
			];

			return this.faker.helpers.arrayElement(formats);
		} catch (err) {
			const formats = [
				`${this.faker.location.city()}, ${this.faker.location.street()}, ${this.faker.location.buildingNumber()}, Apt. ${this.faker.number.int({ min: 1, max: 100 })}`,
				`${this.faker.location.buildingNumber()}, ${this.faker.location.street()}, ${this.faker.location.city()}, ${this.region}`,
				`Apt. ${this.faker.number.int({ min: 1, max: 100 })}, ${this.faker.location.buildingNumber()}, ${this.faker.location.street()}, ${this.faker.location.city()}, ${this.faker.location.zipCode()}, ${this.region}`,
				`${this.faker.location.city()}, ${this.faker.location.street()}, ${this.faker.location.buildingNumber()}, ${this.faker.location.zipCode()}, ${this.region}`,
			];

			return this.faker.helpers.arrayElement(formats);
		}
	}

	private formatFullName(): string {
		const formats = [
			`${this.faker.person.firstName()} ${this.faker.person.lastName()}`,
			`${this.faker.person.lastName()}, ${this.faker.person.firstName()}`,
			`${this.faker.person.firstName()} ${this.faker.person.lastName()} ${this.faker.person.lastName()}`,
			`${this.faker.person.lastName()}, ${this.faker.person.firstName()} ${this.faker.person.lastName()}`,
		];

		return this.faker.helpers.arrayElement(formats);
	}

	generateRecord(index: number) {
		return {
			index,
			id: this.faker.string.uuid(),
			fullName: this.faker.person.fullName(),
			address: this.formatAddress(),
			phoneNumber: this.formatPhoneNumber(),
		};
	}

	generatePage(pageSize: number) {
		const startIndex = (this.pageNumber - 1) * pageSize + 1;
		return Array.from({ length: pageSize }, (_, i) =>
			this.generateRecord(startIndex + i),
		);
	}

	static generateRandomSeed(): number {
		return Math.floor(Math.random() * 1000000);
	}
}

export default RecordGenerator;
