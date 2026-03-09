// Lightweight local classifier for transaction descriptions.
// Returns one of: food, transport, utilities, entertainment,
// health, shopping, education, rent, other

function categorizeTransaction(description = "") {
	const text = String(description).toLowerCase();

	const categories = {
		food: ["restaurant", "zomato", "swiggy", "uber eats", "dominos", "pizza", "biryani", "cafe", "coffee", "meal", "dine", "grocer", "grocery"],
		transport: ["uber", "ola", "taxi", "bus", "metro", "flight", "airline", "cab", "train", "petrol", "fuel"],
		utilities: ["electricity", "water", "gas bill", "bescom", "electric", "bill", "utility", "broadband", "internet", "wifi"],
		entertainment: ["netflix", "spotify", "movie", "cinema", "entertainment", "concert", "play", "show"] ,
		health: ["pharmacy", "hospital", "clinic", "doctor", "apollo", "dental", "medic", "health", "insurance"],
		shopping: ["amazon", "flipkart", "shop", "myntra", "mall", "store", "shopping", "purchase", "order"],
		education: ["course", "udemy", "coursera", "school", "college", "tuition", "education", "book"] ,
		rent: ["rent", "landlord", "apartment", "lease"]
	};

	const scores = {};
	for (const [cat, keywords] of Object.entries(categories)) {
		scores[cat] = 0;
		for (const kw of keywords) {
			if (text.includes(kw)) scores[cat]++;
		}
	}

	// Choose highest scoring category; if tie or all zero -> other
	const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
	if (entries.length === 0 || entries[0][1] === 0) return "other";

	// If top score is unique, return it; otherwise fallback to other
	if (entries.length > 1 && entries[0][1] === entries[1][1]) return "other";
	return entries[0][0];
}

module.exports = { categorizeTransaction };

/*
Optional: Example Anthropic integration (requires API key and node fetch):

async function categorizeTransactionAnthropic(description) {
	const SYSTEM_PROMPT = `You are a personal finance assistant.\nYour job is to categorize expense descriptions into one of these categories:\nfood, transport, utilities, entertainment, health, shopping, education, rent, other.\nReply with ONLY the category name in lowercase.`;
	const res = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": process.env.ANTHROPIC_API_KEY
		},
		body: JSON.stringify({ model: "claude-sonnet-4-20250514", messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: description }], max_tokens: 10 })
	});
	const data = await res.json();
	// adapt based on API response shape
	return (data?.choices?.[0]?.message?.content || "other").trim().toLowerCase();
}
*/
