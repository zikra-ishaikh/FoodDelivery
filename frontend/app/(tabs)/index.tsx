import React, { useEffect, useState, memo } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import {
  StyleSheet, Text, View, FlatList, Image, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, StatusBar, SafeAreaView, Platform, Dimensions, Modal, TouchableWithoutFeedback, Alert
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

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
const getFoodImage = (item: FoodItem) => {
  if (item.name === 'Burger') return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  if (item.name === 'Pizza') return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop';
  if (item.name === 'Sushi') return 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop';
  return item.image;
};

// --- COMPONENTS ---

// 1. Header Component
const Header = memo(({ theme, onProfilePress }: { theme: any, onProfilePress: () => void }) => (
  <View style={[styles.headerContainer, { borderColor: theme.border }]}>
    <View style={styles.locationWrapper}>
      <View style={[styles.locationIconBg, { backgroundColor: theme.isDark ? theme.secondary : 'transparent' }]}>
        <Ionicons name="location" size={20} color={theme.primary} />
      </View>
      <View style={styles.locationTextContainer}>
        <Text style={[styles.locationLabel, { color: theme.text }]}>Home</Text>
        <TouchableOpacity style={styles.locationSubBtn}>
          <Text style={[styles.locationSub, { color: theme.subtext }]} numberOfLines={1}>Block 4, Cyber City, Gurugram</Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color={theme.subtext} />
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity style={[styles.profileBtn, { backgroundColor: theme.secondary, borderColor: theme.cardBg }]} onPress={onProfilePress}>
      <Text style={[styles.profileInitials, { color: theme.primaryDark }]}>Z</Text>
    </TouchableOpacity>
  </View>
));

// 2. Search Bar Component
const SearchBar = memo(({ theme }: { theme: any }) => (
  <View style={styles.searchSection}>
    <View style={[styles.searchBar, { backgroundColor: theme.cardBg, borderColor: theme.border, shadowColor: theme.isDark ? 'transparent' : '#000' }]}>
      <Ionicons name="search" size={20} color={theme.primary} style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Restaurant name or a dish..."
        placeholderTextColor={theme.subtext}
        style={[styles.searchInput, { color: theme.text }]}
      />
      <View style={[styles.micDivider, { backgroundColor: theme.border }]} />
      <TouchableOpacity>
        <Ionicons name="mic" size={20} color={theme.primary} />
      </TouchableOpacity>
    </View>
  </View>
));

// 3. Banner Carousel Component (Updated for Diwali)
const BannerCarousel = memo(({ theme }: { theme: any }) => {
  const { width } = Dimensions.get('window');
  const bannerWidth = width - 32;

  // Use Theme Banners if available, otherwise default
  const bannersToUse = theme.banners
    ? theme.banners.map((url: string, index: number) => ({ id: `theme-${index}`, image: url }))
    : (theme.bannerImage ? [{ id: 'festive', image: theme.bannerImage }, ...BANNERS] : BANNERS);

  return (
    <View style={styles.bannerContainer}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={bannersToUse}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bannerItem, { width: bannerWidth }]}>
            <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
          </View>
        )}
      />
      <View style={styles.pagination}>
        {bannersToUse.map((_: any, i: number) => (
          <View key={i} style={[styles.dot, i === 0 ? styles.dotActive : {}, { backgroundColor: i === 0 && (theme.bannerImage || theme.banners) ? theme.primary : '#D1D5DB' }]} />
        ))}
      </View>
    </View>
  );
});

// 4. Category Component (Updated for Diwali Stickers)
const CategorySection = memo(({ theme }: { theme: any }) => (
  <View style={styles.sectionContainer}>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>Eat what makes you happy</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7}>
          <View style={[styles.categoryIconCircle, { backgroundColor: theme.secondary }]}>
            <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="cover" />

            {/* THEME STICKER OVERLAY */}
            {theme.sticker && (
              <Image
                source={{ uri: theme.sticker }}
                style={{ position: 'absolute', bottom: -5, right: -5, width: 24, height: 24 }}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={[styles.categoryText, { color: theme.text }]}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
));

// --- HELPER COMPONENTS ---
const TricolorText = ({ text, style, theme }: { text: string, style?: any, theme: any }) => {
  if (theme.name !== 'Independence') {
    return <Text style={[style, { color: theme.text }]} numberOfLines={1}>{text}</Text>;
  }

  const len = text.length;
  const p1 = Math.ceil(len / 3);
  const p2 = Math.ceil(2 * len / 3);

  const part1 = text.slice(0, p1);
  const part2 = text.slice(p1, p2);
  const part3 = text.slice(p2);

  return (
    <Text style={style} numberOfLines={1}>
      <Text style={{ color: '#FF9933' }}>{part1}</Text>
      <Text style={{ color: '#FFFFFF' }}>{part2}</Text>
      <Text style={{ color: '#138808' }}>{part3}</Text>
    </Text>
  );
};

// ...

// 4. Horizontal Food Card (Recommended)
const RecommendedCard = memo(({ item, theme }: { item: FoodItem, theme: any }) => (
  <TouchableOpacity activeOpacity={0.9} style={[styles.recCard, { backgroundColor: theme.cardBg }]}>
    <View style={styles.recImageContainer}>
      <Image source={{ uri: getFoodImage(item) }} style={styles.recImage} />
      <View style={[styles.badgePromo, { backgroundColor: theme.primary }]}>
        <Text style={styles.badgeText}>{item.discount ? item.discount + '% OFF' : '50% OFF'}</Text>
      </View>
      <View style={styles.badgeTime}>
        <Text style={styles.badgeTimeText}>{item.distance || 35} mins</Text>
      </View>
    </View>

    <View style={styles.recContent}>
      <View style={styles.rowBetween}>
        {/* TRICOLOR TEXT LOGIC */}
        <View style={{ flex: 1, marginRight: 4 }}>
          <TricolorText text={item.name} theme={theme} style={styles.recName} />
        </View>
        <View style={styles.ratingPill}>
          <Text style={styles.ratingVal}>{item.rating || 4.2}</Text>
          <Ionicons name="star" size={10} color="white" />
        </View>
      </View>
      <Text style={[styles.recCuisine, { color: theme.subtext }]} numberOfLines={1}>Fast Food • Beverages • ₹{item.price}</Text>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.rowBetween}>
        <View style={[styles.trendContainer, { backgroundColor: theme.secondary }]}>
          <View style={styles.trendIconBg}>
            <FontAwesome5 name="chart-line" size={10} color={theme.primary} />
          </View>
          <Text style={[styles.trendText, { color: theme.primaryDark }]}>{item.orderCount || '1200+'} orders</Text>
        </View>
        <TouchableOpacity style={[styles.addBtnSmall, { backgroundColor: theme.secondary }]}>
          <Text style={[styles.addBtnText, { color: theme.primaryDark }]}>ADD +</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
));

// 5. Vertical Restaurant Card (Standard List)
const RestaurantCard = memo(({ item, theme }: { item: FoodItem, theme: any }) => (
  <TouchableOpacity activeOpacity={0.9} style={[styles.resCard, { backgroundColor: theme.cardBg }]}>
    <Image source={{ uri: getFoodImage(item) }} style={styles.resImage} />
    <View style={[styles.resPromoOverlay, { backgroundColor: theme.primary }]}>
      <Text style={styles.resPromoText}>{item.discount ? item.discount + '% OFF' : '60% OFF'}</Text>
    </View>

    <View style={styles.resInfo}>
      <View style={styles.rowBetween}>
        {/* TRICOLOR TEXT LOGIC */}
        <TricolorText text={`${item.name} Palace`} theme={theme} style={styles.resName} />

        <View style={styles.ratingPillRes}>
          <Text style={styles.ratingVal}>{item.rating || 4.5}</Text>
          <Ionicons name="star" size={10} color="white" style={{ marginLeft: 2 }} />
        </View>
      </View>
      <View style={[styles.rowBetween, { marginTop: 4 }]}>
        <Text style={[styles.resMeta, { color: theme.subtext }]}>North Indian • Chinese • ₹200 for one</Text>
        <Text style={[styles.resMeta, { color: theme.subtext }]}>{item.distance || 30} mins</Text>
      </View>
      <View style={[styles.resDivider, { backgroundColor: theme.border }]} />
      <View style={styles.rowAlign}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/616/616490.png' }} style={{ width: 16, height: 16, marginRight: 6 }} />
        <Text style={styles.resFooterText}>Max Safety Delivery by Zomato</Text>
      </View>
    </View>
  </TouchableOpacity>
));


// --- MAIN SCREEN ---
export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { theme, refreshTheme } = useTheme();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // States
  const [activeFilter, setActiveFilter] = useState<'Nearest' | 'Rating' | 'Offers' | null>(null);
  const [sortType, setSortType] = useState<'relevance' | 'rating' | 'time' | 'price_lth' | 'price_htl'>('relevance');
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  // ⚠️ YOUR IP HERE
  const API_URL = 'http://192.168.0.102:3000';

  useEffect(() => {
    refreshTheme();
    fetch(`${API_URL}/foods`)
      .then(res => res.json())
      .then(data => {
        // ENRICH DATA
        const enriched = data.map((item: any) => ({
          ...item,
          price: item.price * 10,
          rating: Number((Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)),
          distance: Math.floor(Math.random() * 45) + 15,
          discount: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : 0,
          orderCount: Math.floor(Math.random() * 2000) + 100
        }));
        setFoods(enriched);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setFoods([
          { id: 101, name: 'Paneer Tikka', price: 280, image: 'https://images.unsplash.com/photo-1599487488170-dad82faf0240', rating: 4.5, distance: 25 },
        ]);
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
      setSortType('relevance');
    }
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const handleLogout = () => {
    setLogoutModalVisible(false); // Close modal

    // NUCLEAR OPTION: Reset the ROOT navigation stack (parent of tabs)
    // We use getParent() to access the Stack Navigator defined in app/_layout.tsx
    setTimeout(() => {
      const rootNav = navigation.getParent();
      if (rootNav) {
        rootNav.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'index' }],
          })
        );
      } else {
        // Fallback if parent not found (unlikely)
        router.replace('/');
      }
    }, 300);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header theme={theme} onProfilePress={() => setLogoutModalVisible(true)} />
        <SearchBar theme={theme} />
        <BannerCarousel theme={theme} />
        <CategorySection theme={theme} />

        {/* Filters / Sort */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {/* SORT CHIP */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              sortType !== 'relevance' && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={toggleSort}
            activeOpacity={0.7}
          >
            <MaterialIcons name="sort" size={16} color={sortType !== 'relevance' ? "white" : theme.text} style={{ marginRight: 4 }} />
            <Text style={[styles.filterText, { color: theme.text }, sortType !== 'relevance' && { color: "white" }]}>
              Sort
              {sortType === 'rating' ? ': Rating' :
                sortType === 'time' ? ': Time' :
                  sortType === 'price_lth' ? ': Low-High' :
                    sortType === 'price_htl' ? ': High-Low' : ''}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={16} color={sortType !== 'relevance' ? "white" : theme.text} />
          </TouchableOpacity>

          {/* NEAREST CHIP */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              activeFilter === 'Nearest' && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => toggleFilter('Nearest')}
          >
            <MaterialIcons name="near-me" size={16} color={activeFilter === 'Nearest' ? "white" : theme.text} style={{ marginRight: 4 }} />
            <Text style={[styles.filterText, { color: theme.text }, activeFilter === 'Nearest' && { color: "white" }]}>Nearest</Text>
          </TouchableOpacity>

          {/* RATING CHIP */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              activeFilter === 'Rating' && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => toggleFilter('Rating')}
          >
            <Ionicons name="star" size={14} color={activeFilter === 'Rating' ? "white" : theme.text} style={{ marginRight: 4 }} />
            <Text style={[styles.filterText, { color: theme.text }, activeFilter === 'Rating' && { color: "white" }]}>Rating 4.0+</Text>
          </TouchableOpacity>

          {/* OFFERS CHIP */}
          <TouchableOpacity
            style={[
              styles.filterChip,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
              activeFilter === 'Offers' && { backgroundColor: theme.primary, borderColor: theme.primary }
            ]}
            onPress={() => toggleFilter('Offers')}
          >
            <MaterialIcons name="local-offer" size={16} color={activeFilter === 'Offers' ? "white" : theme.text} style={{ marginRight: 4 }} />
            <Text style={[styles.filterText, { color: theme.text }, activeFilter === 'Offers' && { color: "white" }]}>Great Offers</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Recommended Section (Horizontal) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended for you</Text>
          <FlatList
            horizontal
            data={filteredFoods}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recListContent}
            renderItem={({ item }) => <RecommendedCard item={item} theme={theme} />}
          />
        </View>

        {/* All Restaurants (Vertical) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>All Restaurants</Text>
          {filteredFoods.map(item => (
            <RestaurantCard key={`res-${item.id}`} item={item} theme={theme} />
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
          <View style={[styles.modalOverlay, { justifyContent: 'flex-end', alignItems: 'center' }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Sort by</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.modalSubTitle, { color: theme.subtext }]}>Sort Options</Text>

                {/* OPTIONS */}
                {[
                  { key: 'relevance', label: 'Relevance (Default)' },
                  { key: 'rating', label: 'Rating: High to Low' },
                  { key: 'time', label: 'Delivery Time: Low to High' },
                  { key: 'price_lth', label: 'Cost: Low to High' },
                  { key: 'price_htl', label: 'Cost: High to Low' },
                ].map((opt: any) => (
                  <TouchableOpacity key={opt.key} style={styles.modalOption} onPress={() => applySort(opt.key)}>
                    <Text style={[styles.modalOptionText, { color: theme.text }, sortType === opt.key && { color: theme.primary, fontWeight: '700' }]}>{opt.label}</Text>
                    <Ionicons name={sortType === opt.key ? "radio-button-on" : "radio-button-off"} size={20} color={sortType === opt.key ? theme.primary : theme.subtext} />
                  </TouchableOpacity>
                ))}

                <View style={[styles.modalDivider, { backgroundColor: theme.border }]} />

                <TouchableOpacity style={styles.clearBtn} onPress={() => applySort('relevance')}>
                  <Text style={styles.clearBtnText}>Clear Sort</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* LOGOUT MODAL */}
      <Modal visible={logoutModalVisible} transparent animationType="fade" onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={[styles.modalOverlay, { justifyContent: 'center' }]}>
          <View style={[styles.logoutCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.logoutTitle, { color: theme.text }]}>Log Out?</Text>
            <Text style={[styles.logoutSub, { color: theme.subtext }]}>Are you sure you want to exit?</Text>
            <View style={styles.logoutRow}>
              <TouchableOpacity onPress={() => setLogoutModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 35 : 0 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },

  // Header
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  locationWrapper: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationIconBg: { marginRight: 10, padding: 4, borderRadius: 8 },
  locationTextContainer: {},
  locationLabel: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  locationSubBtn: { flexDirection: 'row', alignItems: 'center' },
  locationSub: { fontSize: 12, maxWidth: 200, marginRight: 2 },
  profileBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  profileInitials: { fontWeight: '800', fontSize: 16 },

  // Search
  searchSection: { paddingHorizontal: 16, marginBottom: 20, marginTop: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingHorizontal: 16, height: 50, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  micDivider: { width: 1, height: 24, marginHorizontal: 12 },

  // Categories
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 19, fontWeight: '800', paddingHorizontal: 16, marginBottom: 16, letterSpacing: -0.5 },
  categoryList: { paddingHorizontal: 16 },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryIconCircle: { width: 72, height: 72, borderRadius: 36, overflow: 'hidden', marginBottom: 8 },
  categoryImage: { width: '100%', height: '100%' },
  categoryText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },

  // Filters
  filterScroll: { marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 50, borderWidth: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
  filterText: { fontSize: 13, fontWeight: '600' },

  // Recommended Cards
  recListContent: { paddingLeft: 16, paddingRight: 4 },
  recCard: { width: 260, borderRadius: 20, marginRight: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4, marginBottom: 10, overflow: 'hidden' },
  recImageContainer: { height: 150, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  recImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  badgePromo: { position: 'absolute', top: 12, left: 0, paddingHorizontal: 10, paddingVertical: 4, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  badgeTime: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeTimeText: { fontSize: 11, fontWeight: '700', color: '#1F2937' },

  recContent: { padding: 14 },
  recName: { fontSize: 17, fontWeight: '800', flex: 1, marginRight: 4 },
  recCuisine: { fontSize: 13, marginTop: 4, marginBottom: 12, fontWeight: '500' },

  divider: { height: 1, marginBottom: 10 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowAlign: { flexDirection: 'row', alignItems: 'center' },

  ratingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingVal: { color: 'white', fontSize: 12, fontWeight: '700', marginRight: 2 },

  trendContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendIconBg: { marginRight: 6 },
  trendText: { fontSize: 11, fontWeight: '700' },

  addBtnSmall: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { fontWeight: '800', fontSize: 12 },

  // Vertical Restaurant Cards
  resCard: { marginHorizontal: 16, marginBottom: 24, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3, overflow: 'hidden' },
  resImage: { width: '100%', height: 220, resizeMode: 'cover' },
  resPromoOverlay: { position: 'absolute', top: 20, left: -6, paddingHorizontal: 16, paddingVertical: 6, borderTopRightRadius: 8, borderBottomRightRadius: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  resPromoText: { color: 'white', fontWeight: '800', fontSize: 12 },
  resInfo: { padding: 16 },
  resName: { fontSize: 20, fontWeight: '800' },
  resMeta: { fontSize: 14, fontWeight: '500' },
  resDivider: { height: 1, marginVertical: 12 },
  resFooterText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  ratingPillRes: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, // Base style
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, width: '100%', position: 'absolute', bottom: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalSubTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  modalOptionText: { fontSize: 16, fontWeight: '500' },
  modalDivider: { height: 1, marginVertical: 8 },
  clearBtn: { alignItems: 'center', paddingVertical: 16, marginTop: 4 },
  clearBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },

  // Logout Card Styles
  logoutCard: { width: '85%', padding: 24, borderRadius: 20, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 4 },
  logoutTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  logoutSub: { fontSize: 14, marginBottom: 24, textAlign: 'center', fontWeight: '500' },
  logoutRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12 },
  cancelText: { color: '#374151', fontWeight: '700' },
  confirmBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', marginLeft: 8, backgroundColor: '#EF4444', borderRadius: 12 },
  confirmText: { color: 'white', fontWeight: '800' },

  // Banner
  bannerContainer: { marginBottom: 24, paddingHorizontal: 16 },
  bannerItem: { height: 220, borderRadius: 20, overflow: 'hidden', marginRight: 0 },
  bannerImage: { width: '100%', height: '100%' },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', marginHorizontal: 4 },
  dotActive: { width: 24 },
});