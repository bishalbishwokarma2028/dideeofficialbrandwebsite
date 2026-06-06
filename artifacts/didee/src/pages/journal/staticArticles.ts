export type StaticArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  coverImage: string;
  date: string;
  author: string;
  content: string;
};

export const STATIC_ARTICLES: StaticArticle[] = [
  {
    id: "static-1",
    slug: "built-in-nepal-made-for-everyone",
    title: "Built in Nepal. Made for Everyone.",
    excerpt: "How a small team in Kathmandu is redefining what it means to be a South Asian fashion brand in the global era — and why staying local is the ultimate act of rebellion.",
    category: "Brand Story",
    readMinutes: 6,
    coverImage: "/products/product1.jpg",
    date: "Jun 2025",
    author: "DIDEE Editorial",
    content: `
      <p>There's a quiet revolution happening on the streets of Kathmandu. It doesn't look like a protest — it looks like a plaid mini skirt, layered chains, and a pair of worn-in boots walking through Thamel at dusk.</p>

      <p>DIDEE was born from a simple frustration: why were young Nepali people spending their money on cheap fast-fashion imports when there was so much untapped creative talent right here at home?</p>

      <h2>The Problem With Fashion in Nepal</h2>

      <p>For years, the Nepali fashion market was dominated by two extremes: ultra-cheap fast fashion from across the border, or luxury imports that cost more than a month's salary. There was almost nothing in the middle — quality, designed-with-intention clothing that was made in Nepal and priced for real people.</p>

      <p>The Kathmandu street scene had its own visual culture — a blend of Western streetwear, Nepali craft tradition, and the unique energy of a city that's always been a crossroads. But that culture wasn't being reflected in what was sold in shops.</p>

      <h2>What We Built</h2>

      <p>DIDEE started in 2022 with a single collection and a big idea: make world-class clothing in Nepal, for everyone. Not just for the privileged few who could afford imports. Not just for tourists looking for "authentic" crafts. For the students, the creatives, the professionals, the people who want to dress well and feel good.</p>

      <p>Every piece in our collection is made in Nepal by skilled craftspeople who take pride in their work. We use quality materials, real construction techniques, and honest pricing. No shortcuts. No greenwashing. Just great clothes.</p>

      <h2>Built in Nepal. Made for Everyone.</h2>

      <p>Our tagline isn't just a slogan — it's a commitment. Built in Nepal means our roots, our people, our craft. Made for Everyone means we refuse to gatekeep fashion. Everyone deserves to look and feel their best, regardless of budget or background.</p>

      <p>The revolution is quiet. But it's happening. And it looks good.</p>
    `,
  },
  {
    id: "static-2",
    slug: "how-to-style-dark-aesthetic",
    title: "How to Master the Dark Aesthetic Without Losing Yourself",
    excerpt: "Dark fashion isn't about sadness — it's about power. Here's how to build a gothic-inspired wardrobe that feels authentic, layered, and completely yours.",
    category: "Style Guide",
    readMinutes: 4,
    coverImage: "/products/product3.jpg",
    date: "May 2025",
    author: "DIDEE Style Team",
    content: `
      <p>Black has always been the power color. But the dark aesthetic goes beyond color — it's a complete philosophy of dressing that prioritizes intentionality, layering, and self-expression over trend-chasing.</p>

      <h2>Start With the Base Layer</h2>

      <p>Every dark aesthetic outfit starts with a strong base. Think fitted black turtlenecks, oversized band tees, or structured crop tops. The base should be simple and versatile — it's the canvas, not the statement.</p>

      <h2>Layer Like You Mean It</h2>

      <p>Layering is where the dark aesthetic really comes alive. Add a sheer mesh long-sleeve under a crop top. Layer a tailored vest over a flowing shirt. The goal is controlled complexity — pieces that interact with each other to create something more interesting than any single item on its own.</p>

      <h2>Accessories Are Everything</h2>

      <p>Chains, rings, chokers, belts — in the dark aesthetic, accessories aren't afterthoughts. They're punctuation. A single statement chain necklace can transform a simple black tee into an editorial look.</p>

      <h2>The DIDEE Approach</h2>

      <p>Our dark aesthetic pieces are designed to be mixed and matched — every item we make in this range works with everything else. Start with one statement piece and build outward. The goal is a wardrobe, not a costume.</p>

      <p>Most importantly: wear what makes you feel powerful. The dark aesthetic isn't about sadness or performance — it's about owning your presence in a room.</p>
    `,
  },
  {
    id: "static-3",
    slug: "wide-leg-revolution",
    title: "The Wide-Leg Revolution: Why Comfort Is the New Luxury",
    excerpt: "From Kathmandu streets to international runways, wide-leg denim is having its moment. We break down why oversized silhouettes are here to stay — and how to wear them.",
    category: "Trend Report",
    readMinutes: 5,
    coverImage: "/products/product2.jpg",
    date: "Apr 2025",
    author: "DIDEE Editorial",
    content: `
      <p>For most of the 2010s, fashion told us that tight was right. Skinny jeans, bodycon dresses, slim-cut everything. Then something shifted — and wide-leg was suddenly everywhere.</p>

      <h2>Why Wide-Leg Works</h2>

      <p>Wide-leg silhouettes flatter almost every body type. They create a long, flowing line that elongates the figure while providing genuine comfort. They move beautifully. They photograph well. And critically — they feel good to wear all day.</p>

      <p>This is fashion catching up with something people have always known: you can look incredible and be comfortable. These aren't mutually exclusive goals.</p>

      <h2>The Kathmandu Street Influence</h2>

      <p>Kathmandu's street fashion has been ahead on this for years. The city's creative youth embraced oversized and wide-leg silhouettes long before they hit Western runways — partly because of global hip-hop influences, partly because the style genuinely works in Nepal's climate, and partly because Nepali youth have always had their own visual language.</p>

      <h2>How to Style Wide-Leg</h2>

      <p><strong>Balance is everything.</strong> Wide-leg bottoms pair best with fitted or cropped tops. The contrast between volume below and structure above is what makes the look work. Avoid: wide-leg + oversized top. That's a formula for looking shapeless rather than intentional.</p>

      <p><strong>Footwear matters.</strong> Wide-leg jeans look best with chunky boots, platform shoes, or clean white sneakers. Avoid narrow, delicate footwear — it looks visually unbalanced.</p>

      <p><strong>Belts tie it together.</strong> A statement belt at the waist creates definition and prevents the wide-leg look from reading as shapeless.</p>

      <p>The wide-leg revolution isn't going anywhere. It's not a trend — it's a correction. Fashion is finally prioritizing how clothes feel to wear, not just how they look in a photograph.</p>
    `,
  },
  {
    id: "static-4",
    slug: "nepalese-craft-meets-streetwear",
    title: "When Nepalese Craft Meets Modern Streetwear",
    excerpt: "Traditional Dhaka fabric, handwoven textiles, and centuries of craft tradition — meet the designers fusing heritage with hype in the heart of the Himalayas.",
    category: "Culture",
    readMinutes: 7,
    coverImage: "/products/product1.jpg",
    date: "Mar 2025",
    author: "DIDEE Editorial",
    content: `
      <p>Nepal has one of the richest textile traditions in Asia. Dhaka fabric from the Palpa region, Thangka-inspired embroidery, handwoven Pashmina — the country's craft heritage is both ancient and technically sophisticated.</p>

      <p>For most of the modern fashion era, these traditions were treated as separate from global streetwear culture. Traditional for traditional. Modern for modern. Never the two shall meet.</p>

      <p>That wall is coming down.</p>

      <h2>The Fusion Generation</h2>

      <p>A new generation of Nepali designers is refusing to choose between their heritage and their streetwear influences. Why can't a hoodie be cut from Dhaka fabric? Why can't a bomber jacket feature embroidery patterns inspired by Thangka art? Why does "traditional" have to mean "old-fashioned"?</p>

      <p>These questions are driving some of the most exciting fashion design happening in South Asia right now.</p>

      <h2>What This Looks Like in Practice</h2>

      <p>At DIDEE, our Traditional Fusion category is our attempt to participate in this conversation. We work with artisans who have spent their lives mastering traditional craft techniques, and we apply those techniques to contemporary silhouettes and streetwear pieces.</p>

      <p>The result is clothing that couldn't have been made anywhere else in the world. It's specifically, proudly, unmistakably Nepali — and it's also completely current.</p>

      <h2>Why This Matters</h2>

      <p>Fashion has always been how cultures communicate their identity. When Nepali craft traditions appear in streetwear, it's not just a design choice — it's a statement that Nepali culture is contemporary, creative, and present. It belongs in the global conversation about style.</p>

      <p>Built in Nepal. Made for Everyone. This is what that means in practice.</p>
    `,
  },
];

export function findStaticArticle(slug: string): StaticArticle | undefined {
  return STATIC_ARTICLES.find(a => a.slug === slug);
}
