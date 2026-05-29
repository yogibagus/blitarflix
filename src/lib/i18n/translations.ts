export type Language = 'en' | 'id';

export const translations = {
  // ===== HEADER / NAVIGATION =====
  nav: {
    home: { en: 'Home', id: 'Beranda' },
    movies: { en: 'Movies', id: 'Film' },
    tvShows: { en: 'TV Shows', id: 'Acara TV' },
    anime: { en: 'Anime', id: 'Anime' },
    myList: { en: 'My List', id: 'Daftar Saya' },
    search: { en: 'Search...', id: 'Cari...' },
    openSearch: { en: 'Open search', id: 'Buka pencarian' },
    closeMenu: { en: 'Close menu', id: 'Tutup menu' },
    openMenu: { en: 'Open menu', id: 'Buka menu' },
  },

  // ===== LANGUAGE TOGGLE =====
  language: {
    en: { en: 'English', id: 'Inggris' },
    id: { en: 'Bahasa Indonesia', id: 'Bahasa Indonesia' },
    switch: { en: 'Switch Language', id: 'Ganti Bahasa' },
  },

  // ===== HERO SECTION =====
  hero: {
    play: { en: 'Play', id: 'Putar' },
    moreInfo: { en: 'More Info', id: 'Info Lanjut' },
    info: { en: 'Info', id: 'Info' },
    match: { en: 'Match', id: 'Cocok' },
  },

  // ===== MOVIE CARD =====
  card: {
    untitled: { en: 'Untitled', id: 'Tanpa Judul' },
    na: { en: 'N/A', id: 'N/A' },
    movie: { en: 'Movie', id: 'Film' },
    tv: { en: 'TV', id: 'TV' },
  },

  // ===== SECTION HEADINGS =====
  sections: {
    top10Today: { en: 'Top 10 Content Today', id: '10 Konten Teratas Hari Ini' },
    trendingToday: { en: 'Trending Today', id: 'Trending Hari Ini' },
    seeMore: { en: 'See More →', id: 'Lihat Selengkapnya →' },
    platform: { en: 'Platform', id: 'Platform' },
    genre: { en: 'Genre', id: 'Genre' },
    cast: { en: 'Cast', id: 'Pemeran' },
    similarMovies: { en: 'Similar Movies', id: 'Film Serupa' },
    similarTV: { en: 'Similar TV Shows', id: 'Acara TV Serupa' },
    seasons: { en: 'Seasons', id: 'Musim' },
    episode: { en: 'Episode', id: 'Episode' },
    episodes: { en: 'Episodes', id: 'Episode' },
  },

  // ===== PLATFORMS =====
  platforms: {
    all: { en: 'All', id: 'Semua' },
    allPlatforms: { en: 'All Platforms', id: 'Semua Platform' },
    netflix: { en: 'Netflix', id: 'Netflix' },
    prime: { en: 'Prime Video', id: 'Prime Video' },
    disney: { en: 'Disney+', id: 'Disney+' },
    hbo: { en: 'HBO Max', id: 'HBO Max' },
    apple: { en: 'Apple TV+', id: 'Apple TV+' },
    paramount: { en: 'Paramount+', id: 'Paramount+' },
  },

  // ===== GENRES =====
  genres: {
    all: { en: 'All', id: 'Semua' },
    allGenres: { en: 'All Genres', id: 'Semua Genre' },
    selectedGenre: { en: 'Selected Genre', id: 'Genre Terpilih' },
    action: { en: 'Action', id: 'Aksi' },
    adventure: { en: 'Adventure', id: 'Petualangan' },
    animation: { en: 'Animation', id: 'Animasi' },
    comedy: { en: 'Comedy', id: 'Komedi' },
    crime: { en: 'Crime', id: 'Kejahatan' },
    documentary: { en: 'Documentary', id: 'Dokumenter' },
    drama: { en: 'Drama', id: 'Drama' },
    family: { en: 'Family', id: 'Keluarga' },
    fantasy: { en: 'Fantasy', id: 'Fantasi' },
    history: { en: 'History', id: 'Sejarah' },
    horror: { en: 'Horror', id: 'Horor' },
    music: { en: 'Music', id: 'Musik' },
    mystery: { en: 'Mystery', id: 'Misteri' },
    romance: { en: 'Romance', id: 'Romantis' },
    sciFi: { en: 'Sci-Fi', id: 'Fiksi Ilmiah' },
    thriller: { en: 'Thriller', id: 'Thriller' },
    war: { en: 'War', id: 'Perang' },
    western: { en: 'Western', id: 'Barat' },
    // TV-specific genres
    actionAdventure: { en: 'Action & Adventure', id: 'Aksi & Petualangan' },
    kids: { en: 'Kids', id: 'Anak-anak' },
    news: { en: 'News', id: 'Berita' },
    reality: { en: 'Reality', id: 'Realitas' },
    sciFiFantasy: { en: 'Sci-Fi & Fantasy', id: 'Fiksi Ilmiah & Fantasi' },
    soap: { en: 'Soap', id: 'Opera Sabun' },
    talk: { en: 'Talk', id: 'Bincang-bincang' },
    warPolitics: { en: 'War & Politics', id: 'Perang & Politik' },
  },

  // ===== BROWSE PAGES =====
  browse: {
    browseMovies: { en: 'Browse Movies', id: 'Jelajahi Film' },
    browseTV: { en: 'Browse TV Shows', id: 'Jelajahi Acara TV' },
    popularMovies: { en: 'Popular Movies', id: 'Film Populer' },
    popularTV: { en: 'Popular TV Shows', id: 'Acara TV Populer' },
    genreMovies: { en: 'Movies', id: 'Film' },  // e.g. "Action Movies"
    genreTV: { en: 'TV Shows', id: 'Acara TV' },
    movies: { en: 'Movies', id: 'Film' },
    tvShows: { en: 'TV Shows', id: 'Acara TV' },
    noMoviesFound: { en: 'No movies found', id: 'Film tidak ditemukan' },
    noTVFound: { en: 'No TV shows found', id: 'Acara TV tidak ditemukan' },
    noTVShowsFound: { en: 'No TV shows found', id: 'Acara TV tidak ditemukan' },
    noMoreMovies: { en: 'No more movies', id: 'Tidak ada film lagi' },
    noMoreTV: { en: 'No more TV shows', id: 'Tidak ada acara TV lagi' },
    noMoreTVShows: { en: 'No more TV shows', id: 'Tidak ada acara TV lagi' },
    showFilters: { en: 'Show Filters', id: 'Tampilkan Filter' },
    hideFilters: { en: 'Hide Filters', id: 'Sembunyikan Filter' },
    loadMore: { en: 'Load More', id: 'Muat Lebih Banyak' },
    loading: { en: 'Loading...', id: 'Memuat...' },
    loadingMovies: { en: 'Loading movies...', id: 'Memuat film...' },
    loadingTV: { en: 'Loading TV shows...', id: 'Memuat acara TV...' },
    discoverMovies: { en: 'Discover popular and trending movies', id: 'Temukan film populer dan trending' },
    discoverTV: { en: 'Discover popular and trending TV shows', id: 'Temukan acara TV populer dan trending' },
    filterByGenre: { en: 'Filter by Genre', id: 'Filter berdasarkan Genre' },
    filterByPlatform: { en: 'Filter by Platform', id: 'Filter berdasarkan Platform' },
  },

  // ===== SEARCH =====
  search: {
    search: { en: 'Search', id: 'Cari' },
    resultsFor: { en: 'Search results for', id: 'Hasil pencarian untuk' },
    noResults: { en: 'No results found for', id: 'Tidak ada hasil untuk' },
    tryDifferent: { en: 'Try searching with different keywords', id: 'Coba cari dengan kata kunci berbeda' },
    all: { en: 'All', id: 'Semua' },
    movies: { en: 'Movies', id: 'Film' },
    tvShows: { en: 'TV Shows', id: 'Acara TV' },
  },

  // ===== MOVIE/TV DETAIL PAGES =====
  detail: {
    movieNotFound: { en: 'Movie not found', id: 'Film tidak ditemukan' },
    tvNotFound: { en: 'TV show not found', id: 'Acara TV tidak ditemukan' },
    goBackHome: { en: 'Go Back Home', id: 'Kembali ke Beranda' },
    noImage: { en: 'No Image', id: 'Tidak Ada Gambar' },
    playNow: { en: 'Play Now', id: 'Putar Sekarang' },
    inMyList: { en: 'In My List', id: 'Di Daftar Saya' },
    addToList: { en: 'My List', id: 'Daftar Saya' },
    myList: { en: 'My List', id: 'Daftar Saya' },
    failedToLoad: { en: 'Failed to load', id: 'Gagal memuat' },
    noOverview: { en: 'No overview available.', id: 'Tidak ada sinopsis tersedia.' },
    rating: { en: 'Rating', id: 'Rating' },
    releaseDate: { en: 'Release Date', id: 'Tanggal Rilis' },
    firstAirDate: { en: 'First Air Date', id: 'Tanggal Tayang Pertama' },
    runtime: { en: 'Runtime', id: 'Durasi' },
    status: { en: 'Status', id: 'Status' },
    language: { en: 'Language', id: 'Bahasa' },
    minutes: { en: 'min', id: 'menit' },
    seasons: { en: 'Seasons', id: 'Musim' },
    selectSeason: { en: 'Select Season', id: 'Pilih Musim' },
    season: { en: 'Season', id: 'Musim' },
    special: { en: 'Specials', id: 'Spesial' },
    similarMovies: { en: 'Similar Movies', id: 'Film Serupa' },
    similarTVShows: { en: 'Similar TV Shows', id: 'Acara TV Serupa' },
    noDescription: { en: 'No description available.', id: 'Tidak ada deskripsi tersedia.' },
    episodes: { en: 'Episodes', id: 'Episode' },
    episode: { en: 'Episode', id: 'Episode' },
    recentlyReleased: { en: 'Recently Released', id: 'Baru Dirilis' },
    recentlyReleasedMsg: {
      en: 'This movie was recently released. The video may not be available yet on the server, or the quality may be lower than expected. Do you want to continue?',
      id: 'Film ini baru saja dirilis. Video mungkin belum tersedia di server, atau kualitasnya mungkin lebih rendah dari yang diharapkan. Apakah Anda ingin melanjutkan?',
    },
    recentlyReleasedTVMsg: {
      en: 'This TV show episode may not be available yet. The video might still be processing or unavailable on the server. Do you want to continue?',
      id: 'Episode acara TV ini mungkin belum tersedia. Video mungkin masih diproses atau tidak tersedia di server. Apakah Anda ingin melanjutkan?',
    },
    cancel: { en: 'Cancel', id: 'Batal' },
    continueAnyway: { en: 'Continue Anyway', id: 'Lanjutkan Saja' },
    trailer: { en: 'Trailer', id: 'Trailer' },
    noTrailer: { en: 'No trailer available', id: 'Trailer tidak tersedia' },
    noCast: { en: 'No cast information available', id: 'Info pemeran tidak tersedia' },
    network: { en: 'Network', id: 'Jaringan' },
    type: { en: 'Type', id: 'Tipe' },
    episodeRuntime: { en: 'Episode Runtime', id: 'Durasi Episode' },
    genres: { en: 'Genres', id: 'Genre' },
    episodeTitle: { en: 'Episode', id: 'Episode' },  // e.g. "Episode 1"
  },

  // ===== MY LIST =====
  myList: {
    title: { en: 'My List', id: 'Daftar Saya' },
    subtitle: { en: 'Your saved movies and TV shows', id: 'Film dan acara TV yang Anda simpan' },
    empty: { en: 'Your list is empty', id: 'Daftar Anda kosong' },
    emptyDesc: { en: 'Start adding movies and TV shows to your list by clicking the "My List" button on any title.', id: 'Mulai tambahkan film dan acara TV ke daftar Anda dengan mengklik tombol "Daftar Saya" di judul mana pun.' },
    browseMovies: { en: 'Browse Movies', id: 'Jelajahi Film' },
    browseTV: { en: 'Browse TV Shows', id: 'Jelajahi Acara TV' },
    removed: { en: 'Removed from your list', id: 'Dihapus dari daftar Anda' },
    added: { en: 'Added to your list', id: 'Ditambahkan ke daftar Anda' },
    all: { en: 'All', id: 'Semua' },
    movies: { en: 'Movies', id: 'Film' },
    tvShows: { en: 'TV Shows', id: 'Acara TV' },
  },

  // ===== 404 PAGE =====
  notFound: {
    title: { en: 'Page Not Found', id: 'Halaman Tidak Ditemukan' },
    description: {
      en: "The page you're looking for doesn't exist or has been moved. Browse our collection of movies and TV shows instead.",
      id: 'Halaman yang Anda cari tidak ada atau telah dipindahkan. Jelajahi koleksi film dan acara TV kami sebagai gantinya.',
    },
    goBackHome: { en: 'Go Back Home', id: 'Kembali ke Beranda' },
    goBack: { en: 'Go Back', id: 'Kembali' },
    whatToWatch: { en: 'What would you like to watch?', id: 'Apa yang ingin Anda tonton?' },
    browseMovies: { en: 'Browse Movies', id: 'Jelajahi Film' },
    browseTV: { en: 'Browse TV Shows', id: 'Jelajahi Acara TV' },
  },

  // ===== FOOTER =====
  footer: {
    disclaimer: {
      en: 'This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.',
      id: 'Situs ini tidak menyimpan file apapun di server kami, kami hanya terhubung ke media yang dihosting di layanan pihak ketiga.',
    },
    disclaimerShort: {
      en: 'This site does not store any files.',
      id: 'Situs ini tidak menyimpan file apapun.',
    },
    disclaimerFull: {
      en: 'This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.',
      id: 'Situs ini tidak menyimpan file apapun di server kami, kami hanya terhubung ke media yang dihosting di layanan pihak ketiga.',
    },
  },

  // ===== BREADCRUMBS =====
  breadcrumbs: {
    home: { en: 'Home', id: 'Beranda' },
    browse: { en: 'Browse', id: 'Jelajahi' },
    movies: { en: 'Movies', id: 'Film' },
    tvShows: { en: 'TV Shows', id: 'Acara TV' },
    genre: { en: 'Genre', id: 'Genre' },
    platform: { en: 'Platform', id: 'Platform' },
    myList: { en: 'My List', id: 'Daftar Saya' },
    movie: { en: 'Movie', id: 'Film' },
    tvShow: { en: 'TV Show', id: 'Acara TV' },
  },

  // ===== TRENDING FILTER =====
  trending: {
    movies: { en: 'Movies', id: 'Film' },
    tvShows: { en: 'TV Shows', id: 'Acara TV' },
  },
} as const;

export type TranslationKey = typeof translations;