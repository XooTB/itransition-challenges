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

	private deleteCharacter(str: string): string {
		if (str.length === 0) return str;
		const index = Math.floor(this.random() * str.length);
		return str.slice(0, index) + str.slice(index + 1);
	}

	private addCharacter(str: string, allowedChars: string): string {
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

	private applyRandomError(str: string, allowedChars: string): string {
		const errorType = Math.floor(this.random() * 3);
		switch (errorType) {
			case 0:
				return this.deleteCharacter(str);
			case 1:
				return this.addCharacter(str, allowedChars);
			case 2:
				return this.swapCharacters(str);
			default:
				return str;
		}
	}

	applyErrors(info: Info): Info {
		const errorCount = Math.floor(this.errorRate);
		const fractionalError = this.errorRate - errorCount;
		const result = { ...info };

		const applyErrorToField = (
			field: "fullName" | "address" | "phoneNumber",
		) => {
			let allowedChars: string;
			switch (field) {
				case "fullName":
					allowedChars =
						"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ";
					break;
				case "address":
					allowedChars =
						"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ,.";
					break;
				case "phoneNumber":
					allowedChars = "0123456789-";
					break;
			}
			result[field] = this.applyRandomError(result[field], allowedChars);
		};

		const fields: ("fullName" | "address" | "phoneNumber")[] = [
			"fullName",
			"address",
			"phoneNumber",
		];

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
