import { BookOpen } from 'lucide-react';

export default function ArticlesPage() {
  const articles = [
    {
      id: 1,
      title: 'The Art of the Aperitivo: A Sicilian Evening Ritual',
      excerpt: 'In Sicily, the aperitivo is not merely a drink before dinner—it\'s a sacred pause, a moment when the day\'s heat begins to relent and the streets fill with the sound of ice clinking in glasses...',
      author: 'In the style of Stanley Tucci',
      date: 'Coming Soon',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800',
    },
    {
      id: 2,
      title: 'Markets of the Morning: Where Sicily Feeds Itself',
      excerpt: 'The markets open before dawn, when the air still holds the night\'s coolness. Fishermen arrive with their catch, still silver-bright and smelling of the sea...',
      author: 'In the style of Stanley Tucci',
      date: 'Coming Soon',
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800',
    },
    {
      id: 3,
      title: 'The Last Tonnara: Tuna Fishing in Marzamemi',
      excerpt: 'The ancient tonnara stands sentinel over the harbor, its stone walls weathered by centuries of salt spray. Once, these buildings processed the bluefin tuna that made Sicily wealthy...',
      author: 'In the style of Stanley Tucci',
      date: 'Coming Soon',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-terracotta-50 to-terracotta-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-gold-600" />
            <h1 className="text-4xl font-bold text-espresso-900">Travel Articles</h1>
          </div>
          <p className="text-lg text-espresso-700">
            Stories from Sicily, told with the warmth and wisdom of someone who's been there, 
            eaten that, and knows exactly where to find it again.
          </p>
        </div>

        <div className="space-y-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg overflow-hidden card-shadow hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h2 className="text-2xl font-bold text-espresso-900 mb-3">
                    {article.title}
                  </h2>
                  <p className="tucci-text text-espresso-800 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-espresso-600">
                    <span>{article.author}</span>
                    <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full">
                      {article.date}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center bg-white rounded-lg p-8 card-shadow">
          <h2 className="text-2xl font-bold text-espresso-900 mb-4">More Stories Coming Soon</h2>
          <p className="text-espresso-600">
            We're crafting more stories from Sicily and beyond. Check back soon for tales of 
            hidden trattorias, family recipes, and the places where locals actually eat.
          </p>
        </div>
      </div>
    </div>
  );
}
