type Info = {
	index: number;
	id: string;
	fullName: string;
	address: string;
	phoneNumber: string;
};

class ErrorGenerator {
	private errorRate: number;
	private seed: number;

	constructor(seed: number = Date.now(), errorRate = 0) {
		this.seed = seed;
		this.errorRate = errorRate;
	}

	setErrorRate(rate: number) {
		this.errorRate = Math.max(0, Math.min(1000, rate));
	}

	private random(): number {
		const x = Math.sin(this.seed++) * 10000;
		return x - Math.floor(x);
	}

	private deleteCharacter(str: string, minLength: number): string {
		if (str.length <= minLength) return str;
		const index = Math.floor(this.random() * str.length);
		return str.slice(0, index) + str.slice(index + 1);
	}

	private addCharacter(
		str: string,
		allowedChars: string,
		maxLength: number,
	): string {
		if (str.length >= maxLength) return str;
		const charToAdd =
			allowedChars[Math.floor(this.random() * allowedChars.length)];
		const index = Math.floor(this.random() * (str.length + 1));
		return str.slice(0, index) + charToAdd + str.slice(index);
	}

	private swapCharacters(str: string): string {
		if (str.length < 2) return str;
		const index = Math.floor(this.random() * (str.length - 1));
		return (
			str.slice(0, index) + str[index + 1] + str[index] + str.slice(index + 2)
		);
	}

	private applyRandomError(
		str: string,
		allowedChars: string,
		minLength: number,
		maxLength: number,
	): string {
		const errorType = Math.floor(this.random() * 3);
		switch (errorType) {
			case 0:
				return this.deleteCharacter(str, minLength);
			case 1:
				return this.addCharacter(str, allowedChars, maxLength);
			case 2:
				return this.swapCharacters(str);
			default:
				return str;
		}
	}

	private ensureMinLength(
		str: string,
		minLength: number,
		allowedChars: string,
	): string {
		let result = str;
		while (result.length < minLength) {
			result = this.addCharacter(result, allowedChars, minLength);
		}
		return result;
	}

	private ensureMaxLength(str: string, maxLength: number): string {
		return str.slice(0, maxLength);
	}

	applyErrors(info: Info): Info {
		const errorCount = Math.floor(this.errorRate);
		const fractionalError = this.errorRate - errorCount;
		const result = { ...info };

		const fieldConstraints = {
			fullName: {
				min: 2,
				max: 50,
				chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ",
			},
			address: {
				min: 5,
				max: 100,
				chars:
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ,.",
			},
			phoneNumber: { min: 7, max: 20, chars: "0123456789-" },
		};

		const applyErrorToField = (field: keyof typeof fieldConstraints) => {
			const { min, max, chars } = fieldConstraints[field];
			result[field] = this.applyRandomError(result[field], chars, min, max);
			result[field] = this.ensureMinLength(result[field], min, chars);
			result[field] = this.ensureMaxLength(result[field], max);
		};

		const fields = Object.keys(
			fieldConstraints,
		) as (keyof typeof fieldConstraints)[];

		for (let i = 0; i < errorCount; i++) {
			const field = fields[Math.floor(this.random() * fields.length)];
			applyErrorToField(field);
		}

		if (this.random() < fractionalError) {
			const field = fields[Math.floor(this.random() * fields.length)];
			applyErrorToField(field);
		}

		return result;
	}
}

export default ErrorGenerator;
