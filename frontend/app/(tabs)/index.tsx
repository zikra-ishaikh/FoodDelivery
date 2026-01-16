import React, { useEffect, useState, memo } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, StatusBar, SafeAreaView, Platform, Dimensions, Modal, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// --- CONFIG & THEME ---
const THEME = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#EEF2FF',
  background: '#F9FAFB',
  cardBg: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  accent: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  border: '#E5E7EB',
  shadow: '#000000',
};

// --- TYPES ---
interface FoodItem {
  id: number;
  name: string;
  image: string;
  price: number;
  rating?: number;
  distance?: number; // in mins
  discount?: number;
  orderCount?: number;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

interface Banner {
  id: string;
  image: string;
}

// --- MOCK DATA ---
const BANNERS: Banner[] = [
  { id: '1', image: 'https://img.freepik.com/free-psd/food-menu-restaurant-web-banner-template_106176-1454.jpg' },
  { id: '2', image: 'https://img.freepik.com/free-psd/delicous-asian-food-web-banner-template_120329-1153.jpg' },
  { id: '3', image: 'https://img.freepik.com/free-psd/delicious-burger-food-menu-web-banner-template_106176-1150.jpg' },
];
const CATEGORIES: Category[] = [
  { id: '1', name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
  { id: '2', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' },
  { id: '3', name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
  { id: '4', name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80' },
  { id: '5', name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
  { id: '6', name: 'Chicken', image: 'https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=500&q=80' },
  { id: '7', name: 'Rolls', image: 'https://images.unsplash.com/photo-1679310290259-78d9eaa32700?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3ByaW5nJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '8', name: 'Thali', image: 'https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

// --- HELPER FUNCTIONS ---
// Helper to get custom realistic images for specific items
const getFoodImage = (item: FoodItem) => {
  if (item.name === 'Burger') return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  if (item.name === 'Pizza') return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop';
  if (item.name === 'Sushi') return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop';
  return item.image;
};

// --- COMPONENTS ---

// 1. Header Component
const Header = memo(() => (
  <View style={styles.headerContainer}>
    <View style={styles.locationWrapper}>
      <View style={styles.locationIconBg}>
        <Ionicons name="location" size={20} color={THEME.primary} />
      </View>
      <View style={styles.locationTextContainer}>
        <Text style={styles.locationLabel}>Home</Text>
        <TouchableOpacity style={styles.locationSubBtn}>
          <Text style={styles.locationSub} numberOfLines={1}>Block 4, Cyber City, Gurugram</Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color={THEME.subtext} />
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity style={styles.profileBtn}>
      <Text style={styles.profileInitials}>Z</Text>
    </TouchableOpacity>
  </View>
));

// 2. Search Bar Component
const SearchBar = memo(() => (
  <View style={styles.searchSection}>
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color={THEME.primary} style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Restaurant name or a dish..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
      />
      <View style={styles.micDivider} />
      <TouchableOpacity>
        <Ionicons name="mic" size={20} color={THEME.primary} />
      </TouchableOpacity>
    </View>
  </View>
));

// 3. Banner Carousel Component
const BannerCarousel = memo(() => {
  const { width } = Dimensions.get('window');
  const bannerWidth = width - 32;

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={BANNERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bannerItem, { width: bannerWidth }]}>
            <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
          </View>
        )}
      />
      {/* Pagination Dots (Static for now, can be dynamic with state) */}
      <View style={styles.pagination}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === 0 ? styles.dotActive : {}]} />
        ))}
      </View>
    </View>
  );
});

// 4. Category Component
const CategorySection = memo(() => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Eat what makes you happy</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7}>
          <View style={styles.categoryIconCircle}>
            <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="cover" />
          </View>
          <Text style={styles.categoryText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
));

// 4. Horizontal Food Card (Recommended)
const RecommendedCard = memo(({ item }: { item: FoodItem }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.recCard}>
    <View style={styles.recImageContainer}>
      <Image source={{ uri: getFoodImage(item) }} style={styles.recImage} />
      {/* Overlay Gradient (simulated with lighter view/shadow or View wraps if needed, keeping simple for now) */}
      <View style={styles.badgePromo}>
        <Text style={styles.badgeText}>{item.discount ? item.discount + '% OFF' : '50% OFF'}</Text>
      </View>
      <View style={styles.badgeTime}>
        <Text style={styles.badgeTimeText}>{item.distance || 35} mins</Text>
      </View>
    </View>

    <View style={styles.recContent}>
      <View style={styles.rowBetween}>
        <Text style={styles.recName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.ratingPill}>
          <Text style={styles.ratingVal}>{item.rating || 4.2}</Text>
          <Ionicons name="star" size={10} color="white" />
        </View>
      </View>
      <Text style={styles.recCuisine} numberOfLines={1}>Fast Food • Beverages • ₹{item.price}</Text>

      <View style={styles.divider} />

      <View style={styles.rowBetween}>
        <View style={styles.trendContainer}>
          <View style={styles.trendIconBg}>
            <FontAwesome5 name="chart-line" size={10} color={THEME.primary} />
          </View>
          <Text style={styles.trendText}>{item.orderCount || '1200+'} orders</Text>
        </View>
        <TouchableOpacity style={styles.addBtnSmall}>
          <Text style={styles.addBtnText}>ADD +</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
));

// 5. Vertical Restaurant Card (Standard List)
const RestaurantCard = memo(({ item }: { item: FoodItem }) => (
  <TouchableOpacity activeOpacity={0.9} style={styles.resCard}>
    <Image source={{ uri: getFoodImage(item) }} style={styles.resImage} />
    <View style={styles.resPromoOverlay}>
      <Text style={styles.resPromoText}>{item.discount ? item.discount + '% OFF' : '60% OFF'}</Text>
    </View>

    <View style={styles.resInfo}>
      <View style={styles.rowBetween}>
        <Text style={styles.resName}>{item.name} Palace</Text>
        <View style={styles.ratingPillRes}>
          <Text style={styles.ratingVal}>{item.rating || 4.5}</Text>
          <Ionicons name="star" size={10} color="white" style={{ marginLeft: 2 }} />
        </View>
      </View>
      <View style={[styles.rowBetween, { marginTop: 4 }]}>
        <Text style={styles.resMeta}>North Indian • Chinese • ₹200 for one</Text>
        <Text style={styles.resMeta}>{item.distance || 30} mins</Text>
      </View>
      <View style={styles.resDivider} />
      <View style={styles.rowAlign}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/616/616490.png' }} style={{ width: 16, height: 16, marginRight: 6 }} />
        <Text style={styles.resFooterText}>Max Safety Delivery by Zomato</Text>
      </View>
    </View>
  </TouchableOpacity>
));


// --- MAIN SCREEN ---
export default function HomeScreen() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeFilter, setActiveFilter] = useState<'Nearest' | 'Rating' | 'Offers' | null>(null);
  const [sortType, setSortType] = useState<'relevance' | 'rating' | 'time' | 'price_lth' | 'price_htl'>('relevance');
  const [modalVisible, setModalVisible] = useState(false);

  // ⚠️ YOUR IP HERE
  const API_URL = 'http://192.168.0.102:3000';

  useEffect(() => {
    fetch(`${API_URL}/foods`)
      .then(res => res.json())
      .then(data => {
        // ENRICH DATA with mock attributes
        const enriched = data.map((item: any) => ({
          ...item,
          price: item.price * 10, // Convert mock dollar price to roughly rupees
          rating: Number((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)), // Ensure Number type
          distance: Math.floor(Math.random() * 45) + 15, // 15 to 60 mins
          discount: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : 0, // 0 or 10-60%
          orderCount: Math.floor(Math.random() * 2000) + 100
        }));
        setFoods(enriched);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  const filteredFoods = React.useMemo(() => {
    let result = [...foods];

    // 1. Filter
    if (activeFilter === 'Nearest') {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (activeFilter === 'Rating') {
      result = result.filter(item => (item.rating || 0) >= 4.0);
    } else if (activeFilter === 'Offers') {
      result = result.filter(item => (item.discount || 0) > 0);
    }

    // 2. Sort (Price) - Overrides distance sort if active
    // 2. Sort Logic (Zomato Style)
    if (sortType === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortType === 'time') {
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortType === 'price_lth') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortType === 'price_htl') {
      result.sort((a, b) => b.price - a.price);
    }
    // 'relevance' = no specific sort (default order)

    return result;
  }, [foods, activeFilter, sortType]);

  const toggleSort = () => {
    setModalVisible(true);
  };

  const applySort = (type: 'relevance' | 'rating' | 'time' | 'price_lth' | 'price_htl') => {
    setSortType(type);
    setModalVisible(false);
  };

  const toggleFilter = (filter: 'Nearest' | 'Rating' | 'Offers') => {
    if (filter === 'Nearest') {
      setSortType('relevance'); // Disable Price sort if Nearest is active
    }
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <SearchBar />
        <BannerCarousel />
        <CategorySection />

        {/* Filters / Sort (Optional) */}
        {/* Filters / Sort */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {/* SORT CHIP */}
          <TouchableOpacity
            style={[sortType !== 'relevance' ? styles.filterChipActive : styles.filterChip, { marginRight: 8 }]}
            onPress={toggleSort}
            activeOpacity={0.7}
          >
            <MaterialIcons name="sort" size={16} color={sortType !== 'relevance' ? "white" : THEME.text} style={{ marginRight: 4 }} />
            <Text style={sortType !== 'relevance' ? styles.filterTextActive : styles.filterText}>
              Sort
              {sortType === 'rating' ? ': Rating' :
                sortType === 'time' ? ': Time' :
                  sortType === 'price_lth' ? ': Low-High' :
                    sortType === 'price_htl' ? ': High-Low' : ''}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={16} color={sortType !== 'relevance' ? "white" : THEME.text} />
          </TouchableOpacity>

          {/* NEAREST CHIP */}
          <TouchableOpacity
            style={activeFilter === 'Nearest' ? styles.filterChipActive : styles.filterChip}
            onPress={() => toggleFilter('Nearest')}
          >
            <MaterialIcons name="near-me" size={16} color={activeFilter === 'Nearest' ? "white" : THEME.text} style={{ marginRight: 4 }} />
            <Text style={activeFilter === 'Nearest' ? styles.filterTextActive : styles.filterText}>Nearest</Text>
          </TouchableOpacity>

          {/* RATING CHIP */}
          <TouchableOpacity
            style={activeFilter === 'Rating' ? styles.filterChipActive : styles.filterChip}
            onPress={() => toggleFilter('Rating')}
          >
            <Ionicons name="star" size={14} color={activeFilter === 'Rating' ? "white" : THEME.text} style={{ marginRight: 4 }} />
            <Text style={activeFilter === 'Rating' ? styles.filterTextActive : styles.filterText}>Rating 4.0+</Text>
          </TouchableOpacity>

          {/* OFFERS CHIP */}
          <TouchableOpacity
            style={activeFilter === 'Offers' ? styles.filterChipActive : styles.filterChip}
            onPress={() => toggleFilter('Offers')}
          >
            <MaterialIcons name="local-offer" size={16} color={activeFilter === 'Offers' ? "white" : THEME.text} style={{ marginRight: 4 }} />
            <Text style={activeFilter === 'Offers' ? styles.filterTextActive : styles.filterText}>Great Offers</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recommended Section (Horizontal) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <FlatList
            horizontal
            data={filteredFoods}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recListContent}
            renderItem={({ item }) => <RecommendedCard item={item} />}
          />
        </View>

        {/* All Restaurants (Vertical) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>All Restaurants</Text>
          {filteredFoods.map(item => (
            <RestaurantCard key={`res-${item.id}`} item={item} />
          ))}
        </View>

      </ScrollView>

      {/* SORT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Sort by</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={24} color={THEME.text} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSubTitle}>Sort Options</Text>

                {/* RELEVANCE */}
                <TouchableOpacity style={styles.modalOption} onPress={() => applySort('relevance')}>
                  <Text style={[styles.modalOptionText, sortType === 'relevance' && styles.modalOptionTextActive]}>Relevance (Default)</Text>
                  <Ionicons name={sortType === 'relevance' ? "radio-button-on" : "radio-button-off"} size={20} color={sortType === 'relevance' ? THEME.primary : "#9CA3AF"} />
                </TouchableOpacity>

                {/* RATING */}
                <TouchableOpacity style={styles.modalOption} onPress={() => applySort('rating')}>
                  <Text style={[styles.modalOptionText, sortType === 'rating' && styles.modalOptionTextActive]}>Rating: High to Low</Text>
                  <Ionicons name={sortType === 'rating' ? "radio-button-on" : "radio-button-off"} size={20} color={sortType === 'rating' ? THEME.primary : "#9CA3AF"} />
                </TouchableOpacity>

                {/* TIME */}
                <TouchableOpacity style={styles.modalOption} onPress={() => applySort('time')}>
                  <Text style={[styles.modalOptionText, sortType === 'time' && styles.modalOptionTextActive]}>Delivery Time: Low to High</Text>
                  <Ionicons name={sortType === 'time' ? "radio-button-on" : "radio-button-off"} size={20} color={sortType === 'time' ? THEME.primary : "#9CA3AF"} />
                </TouchableOpacity>

                {/* PRICE - LOW TO HIGH */}
                <TouchableOpacity style={styles.modalOption} onPress={() => applySort('price_lth')}>
                  <Text style={[styles.modalOptionText, sortType === 'price_lth' && styles.modalOptionTextActive]}>Cost: Low to High</Text>
                  <Ionicons name={sortType === 'price_lth' ? "radio-button-on" : "radio-button-off"} size={20} color={sortType === 'price_lth' ? THEME.primary : "#9CA3AF"} />
                </TouchableOpacity>

                {/* PRICE - HIGH TO LOW */}
                <TouchableOpacity style={styles.modalOption} onPress={() => applySort('price_htl')}>
                  <Text style={[styles.modalOptionText, sortType === 'price_htl' && styles.modalOptionTextActive]}>Cost: High to Low</Text>
                  <Ionicons name={sortType === 'price_htl' ? "radio-button-on" : "radio-button-off"} size={20} color={sortType === 'price_htl' ? THEME.primary : "#9CA3AF"} />
                </TouchableOpacity>

                <View style={styles.modalDivider} />

                <TouchableOpacity style={styles.clearBtn} onPress={() => applySort('relevance')}>
                  <Text style={styles.clearBtnText}>Clear Sort</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.background, paddingTop: Platform.OS === 'android' ? 35 : 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.background },
  scrollContent: { paddingBottom: 100 },

  // Header
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  locationWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationIconBg: { marginRight: 10 },
  locationTextContainer: {},
  locationLabel: { fontSize: 16, fontWeight: '800', color: THEME.text, letterSpacing: -0.3 },
  locationSubBtn: { flexDirection: 'row', alignItems: 'center' },
  locationSub: { fontSize: 12, color: THEME.subtext, maxWidth: 200, marginRight: 2 },
  profileBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C7D2FE', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  profileInitials: { color: THEME.primaryDark, fontWeight: '800', fontSize: 16 },

  // Search
  searchSection: { paddingHorizontal: 16, marginBottom: 20, marginTop: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, height: 50, shadowColor: THEME.shadow, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, borderWidth: 1, borderColor: '#F3F4F6' },
  searchInput: { flex: 1, fontSize: 15, color: THEME.text, fontWeight: '500' },
  micDivider: { width: 1, height: 24, backgroundColor: '#E5E7EB', marginHorizontal: 12 },

  // Categories
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 19, fontWeight: '800', color: THEME.text, paddingHorizontal: 16, marginBottom: 16, letterSpacing: -0.5 },
  categoryList: { paddingHorizontal: 16 },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryIconCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', marginBottom: 8, backgroundColor: '#F3F4F6' },
  categoryImage: { width: '100%', height: '100%' },
  categoryText: { fontSize: 13, fontWeight: '600', color: '#374151', textAlign: 'center' },

  // Filters
  filterScroll: { marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center' },
  filterChipActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, backgroundColor: '#1F2937', marginRight: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: '#1F2937' },
  filterText: { fontSize: 13, fontWeight: '600', color: THEME.text },
  filterTextActive: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  // Recommended Cards (Horizontal)
  recListContent: { paddingLeft: 16, paddingRight: 4 },
  recCard: { width: 260, backgroundColor: '#FFFFFF', borderRadius: 20, marginRight: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4, marginBottom: 10 },
  recImageContainer: { height: 150, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  recImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgePromo: { position: 'absolute', top: 12, left: 0, backgroundColor: '#3B82F6', paddingHorizontal: 10, paddingVertical: 4, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  badgeTime: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeTimeText: { fontSize: 11, fontWeight: '700', color: '#1F2937' },

  recContent: { padding: 14 },
  recName: { fontSize: 17, fontWeight: '800', color: THEME.text, flex: 1, marginRight: 4 },
  recCuisine: { fontSize: 13, color: THEME.subtext, marginTop: 4, marginBottom: 12, fontWeight: '500' },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 10 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },

  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingVal: { color: 'white', fontSize: 12, fontWeight: '700', marginRight: 2 },

  trendContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3E8FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendIconBg: { marginRight: 6 },
  trendText: { fontSize: 11, fontWeight: '700', color: '#6B21A8' },

  addBtnSmall: { backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: THEME.primaryDark, fontWeight: '800', fontSize: 12 },

  // Vertical Restaurant Cards
  resCard: { marginHorizontal: 16, marginBottom: 24, backgroundColor: 'white', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, overflow: 'hidden' },
  resImage: { width: '100%', height: 220, resizeMode: 'cover' },
  resPromoOverlay: { position: 'absolute', top: 20, left: -6, backgroundColor: '#2563EB', paddingHorizontal: 16, paddingVertical: 6, borderTopRightRadius: 8, borderBottomRightRadius: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  resPromoText: { color: 'white', fontWeight: '800', fontSize: 12 },
  resInfo: { padding: 16 },
  resName: { fontSize: 20, fontWeight: '800', color: THEME.text },
  resMeta: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  resDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  resFooterText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  ratingPillRes: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: THEME.text },
  modalSubTitle: { fontSize: 13, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  modalOptionText: { fontSize: 16, fontWeight: '500', color: '#374151' },
  modalOptionTextActive: { color: THEME.primary, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  clearBtn: { alignItems: 'center', paddingVertical: 16, marginTop: 4 },
  clearBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },

  // Banner
  bannerContainer: { marginBottom: 24, paddingHorizontal: 16 },
  bannerItem: { height: 220, borderRadius: 20, overflow: 'hidden', marginRight: 0 }, // pagingEnabled on full width container
  bannerImage: { width: '100%', height: '100%' },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', marginHorizontal: 4 },
  dotActive: { backgroundColor: THEME.primary, width: 24 },
});