import {
  exploreStyles as styles,
  useState,
  useEffect,
  Card,
  IoArrowForward,
  calculateColumns,
  getLeftoverGridClass,
  splitCardsIntoMainAndLeftover,
  SearchBox,
  cardData,
  formatName,
} from "./imports";

/**
 * Explore component that displays a grid of cards and a search box to filter them.
 *
 * @component
 * @returns {JSX.Element} The Explore component.
 */
const Explore = () => {
  const [columns, setColumns] = useState(3);
  const [screenType, setScreenType] = useState("desktop");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState(cardData);

  /**
   * Handles window resize events to adjust the number of columns and screen type.
   */
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setColumns(calculateColumns(width));

      if (width <= 800) {
        setScreenType("mobile");
      } else if (width <= 1349) {
        setScreenType("tablet");
      } else {
        setScreenType("desktop");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Filters the card data based on the search query.
   */
  useEffect(() => {
    const filtered = cardData.filter(
      (card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(filtered);
  }, [searchQuery]);

  const { mainGridCards, leftoverCards } = splitCardsIntoMainAndLeftover(
    filteredCards,
    columns
  );

  return (
    <>
      <div className={styles.exploreWrapper}>
        <div className={styles.mainText}>
          <div className={styles.leftContainer}>
            <h1>Explore</h1>
            <IoArrowForward className={styles.arrowIcon} />
          </div>
          <SearchBox onSearch={setSearchQuery} />
        </div>
        <div className={styles.gridContainer}>
          {mainGridCards.map((card, index) => (
            <div key={index} className={styles.gridItem}>
              <Card
                {...card}
                name={formatName(card.name, true, screenType, false)}
              />
            </div>
          ))}
        </div>
        {leftoverCards.length > 0 && columns > 1 && (
          <div
            className={`${styles.leftoverGrid} ${getLeftoverGridClass(
              leftoverCards.length,
              styles
            )}`}
          >
            {leftoverCards.map((card, index) => (
              <div key={index} className={styles.gridItem}>
                <Card
                  {...card}
                  name={formatName(card.name, true, screenType, true)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
