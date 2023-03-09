import React, {useCallback, useRef, useState} from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import GridContext from './context';
import {generateSections} from "./utils";

export default function App() {
  const allSection = useRef(generateSections(200)).current
  const refSectionList = useRef();
  const lastIndex = useRef(3);
  const [sections, setSections] = useState([allSection[0], allSection[1], allSection[2], allSection[lastIndex.current]])
  const [pending, setPending] = useState(false);
  const value = useState({});

  const onEndReached = useCallback(() => {
    if (!pending) {
      setPending(true);
      const delay = new Promise((resolve) => setTimeout(resolve, 2000))

      delay.then(() => {
        setSections(prevState => ([
          ...prevState,
          allSection[lastIndex.current + 1],
          allSection[lastIndex.current + 2],
          allSection[lastIndex.current + 3],
          allSection[lastIndex.current + 4]
        ]))
        lastIndex.current = lastIndex.current + 4;
        setPending(false);
      })
    }
  }, [pending])

  const onScrollToIndexFailed = useCallback(() => {
    const delay = new Promise((resolve) => setTimeout(resolve, 500))

    delay.then(() => {
      refSectionList.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
        animated: true,
      })
    })
  }, [refSectionList])

  return (
    <SafeAreaView style={styles.container}>
      <GridContext.Provider value={value}>
        <SectionList
          sections={sections}
          ListFooterComponent={
            pending ? <ActivityIndicator /> : null
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          windowSize={7}
          initialNumToRender={3}
          onScrollToIndexFailed={onScrollToIndexFailed}
          renderSectionHeader={(headerData) => {
            const { section: { key, date } } = headerData;

            return (
              <GridContext.Consumer>
                {(ctx: any) => {
                  return (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        ctx[1]({
                          ...ctx[0],
                          [key]: !(ctx[0] || {})[key],
                        })
                      }}
                    >
                      <View style={styles.wrapHeaderSection}>
                        <Text>{date}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )
                }}
              </GridContext.Consumer>
            )
          }}
          renderItem={(sectionListItem) => {
            const { item } = sectionListItem;

            return (
              <GridContext.Consumer>
                {(ctx: any) => {
                  if (ctx[0][item.parentKey]) {
                    return null
                  }

                  return (
                    <FlatList
                      horizontal
                      data={item.data}
                      style={styles.wrapFlatListSection}
                      showsHorizontalScrollIndicator={false}
                      initialNumToRender={3}
                      renderItem={(itemData) => {
                        return (
                          <View style={styles.cardContainer}>
                            <Text>123</Text>
                          </View>
                        )
                      }}
                    />
                  )
                }}
              </GridContext.Consumer>
            );
          }}
        />
      </GridContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 144,
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    marginHorizontal: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapFlatListSection: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  wrapHeaderSection: {
    alignItems: 'center',
    backgroundColor: '#8C64E6',
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
