export default {
	coupons: {
		Experience: [
			'A day at the beach',
			'Picnic in the park',
			'Night at your favorite nightclub',
			'Relaxing day at the spa',
			'Romantic weekend skiing',
			'A day at the museum',
			'A day at the zoo or arboretum',
			'A day at an amusement park',
			'Go to a music festival together',
			'Take a road trip together',
		],
		Relaxing: [
			'Spend a whole day in bed',
			'Read a book together',
			'Color a coloring book together',
			'Listen to a podcast together',
			'Listen to each other’s favorite songs',
			'Play cards together',
			'Play video games together',
			'Make something together',
			'Decorate the home together',
			'Spend an evening planning for your future together',
		],
		Foodies: [
			'Go out for ice cream',
			'Recreate your first dinner date together',
			'Let’s try new ethnic food',
			'Surprise me for lunch at work',
			'Go out for a tasting menu',
			'Tapas or appetizers for dinner',
			'Have Sunday brunch together',
			'Just drinks and desserts',
			'Cook or bake together',
			'Have a cocktail party for two',
		],
	},
};
export type TextPerCategory = { [category: string]: string[] };
export type Data = {
	coupons: TextPerCategory;
};
