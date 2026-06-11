export interface SoftwareProject {
	title: string;
	slug: string;
	status: string;
	type?: string;
	stack?: string[];
	repo?: string;
	description?: string;
}

export interface SoftwareIdea {
	title: string;
	captured: string;
	notes: string;
}
