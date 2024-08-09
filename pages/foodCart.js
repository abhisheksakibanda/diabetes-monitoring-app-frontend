// import { View, StyleSheet } from "react-native";
// import {
//   Text,
//   Button,
//   List,
//   Divider,
//   useTheme,
//   IconButton,
//   Tooltip,
// } from "react-native-paper";
// import { useSelector, useDispatch } from "react-redux";
// import { calculateCarbs, getInsulinDose } from "../utils/nutritionCalculation";
// import { RemoveFoodItem } from "../redux/actions/actionTypes";
// import { useEffect } from "react";
// import { fetchFoodItemByIdAPI } from "../redux/actions/actions";
// import axios from "axios";
// import { BASE_URL } from "@env"

// const FoodCart = ({ navigation, route }) => {
//   const { tag } = route?.params;
//   const theme = useTheme();
//   const dispatch = useDispatch();

//   const user = useSelector(state => state.user);
//   console.log(user)
//   console.log("User her: ", user?.userProfInfo?.userProfData);
//   const foodData = useSelector(state => state.api);
//   const foodItems = useSelector(state => state.addFood);
//   let icr;
//   const totalCarbs =
//     foodItems?.foodItems?.length > 0 ? calculateCarbs(foodItems?.foodItems) : 0;
//   if (tag === "Breakfast") {
//     icr = user?.userProfInfo?.userProfData.bfICR;
//   } else if (tag === "Lunch") {
//     icr = user?.userProfInfo?.userProfData.lhICR;
//   } else {
//     icr = user?.userProfInfo?.userProfData.dnICR;
//   }
//   const insulinDose = getInsulinDose(totalCarbs, icr);

//   useEffect(() => {
//     if (foodData?.foodItem?.fdcId && foodData.success) {
//       navigation.navigate("AddFood", {
//         tag: tag,
//         isDelete: true,
//       });
//     }
//   }, [foodData]);

//   const onSave = async () => {
//     let userICR;

//     if (tag === "Breakfast") {
//       userICR = user?.userProfInfo?.userProfData.bfICR;
//     } else if (tag === "Lunch") {
//       userICR = user?.userProfInfo?.userProfData.lhICR;
//     } else {
//       userICR = user?.userProfInfo?.userProfData.dnICR;
//     }
//     console.log("icc: ", userICR);
//     console.log("user: ", user)
//     let params = {
//       userId: user?.user?.uid,
//       mealItems: foodItems.foodItems,
//       totalCarbs: totalCarbs,
//       mealType: tag,
//       insulinDose: insulinDose,
//       userCRR: user?.userProfInfo?.userProfData.crr,
//       userICR: userICR,
//     };
//     console.log("params: ", params);
//     await axios.post(`${BASE_URL}/api/submitData`, params)
//       .then(() => {
//         console.log("Data submitted successfully.");
//         navigation.navigate("HomeScreen");
//       }).catch(e => console.log("Error: ", e));
//   };

//   const getCarbs = item => {
//     let carbs;
//     carbs = item.foodNutrients.find(y => parseInt(y.number) === 205);
//     return carbs ? carbs.amount : 0;
//   };

//   const handleEditItem = fdcId => {
//     // Handle edit action here
//     const params = {
//       format: "abridged",
//       nutrients: "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
//     };
//     dispatch(fetchFoodItemByIdAPI(params, fdcId, tag));
//   };

//   const handleDeleteItem = fdcId => {
//     // Handle delete action here
//     const updatedArray = foodItems?.foodItems?.filter(item => item.fdcId !== fdcId);
//     dispatch(RemoveFoodItem(updatedArray));
//   };

//   const EmptyCart = () => (
//     <View style={styles.emptyCartContainer}>
//       <Text style={styles.message}>Your cart is empty!</Text>
//       <Button
//         mode="contained"
//         onPress={() => navigation.goBack()}
//         style={styles.button}
//       >
//         Go Back
//       </Button>
//     </View>
//   );

//   const RightListView = ({ item }) => (
//     <View>
//       <Text>Quantity: {item?.count}</Text>
//     </View>
//   );

//   const Content = () => (
//     <>
//       <List.Section style={styles.listSection}>
//         <List.Subheader>
//           {" "}
//           <Text style={styles.message}>My Food Cart</Text>
//         </List.Subheader>
//         {foodItems?.foodItems?.map((item, index) => (
//           <View key={item.fdcId} style={{ flexDirection: "row" }}>
//             <List.Item
//               style={{ flex: 1 }}
//               key={index}
//               title={item.description}
//               description={`Carbs : ${getCarbs(item)}`}
//               right={() => <RightListView item={item} />}
//             />
//             <Tooltip title="Edit" leaveTouchDelay={1000}>
//               <IconButton
//                 icon="pencil"
//                 onPress={() => handleEditItem(item.fdcId)}
//                 iconColor={theme.colors.primary}
//               />
//             </Tooltip>
//             <Tooltip title="Delete" leaveTouchDelay={1000}>
//               <IconButton
//                 icon="delete"
//                 onPress={() => handleDeleteItem(item.fdcId)}
//                 iconColor={theme.colors.error}
//               />
//             </Tooltip>
//           </View>
//         ))}
//       </List.Section>
//       <Divider />
//       <View style={styles.totalContainer}>
//         <Text style={styles.totalText}>
//           Total Carbs: {totalCarbs ? totalCarbs?.toFixed(2) : 0} g
//         </Text>
//         <Text style={styles.totalText}>
//           Your Insulin Dose: {insulinDose ? insulinDose : 0} units
//         </Text>
//         <Button onPress={onSave} mode="contained" style={styles.saveButton}>
//           Save
//         </Button>
//       </View>
//     </>
//   );

//   return (
//     <View style={styles.container}>
//       {foodItems?.foodItems?.length > 0 ? <Content /> : <EmptyCart />}
//     </View>
//   );
// };

// export default FoodCart;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   emptyCartContainer: {
//     justifyContent: "center",
//     flex: 1,
//     alignItems: "center",
//   },
//   message: {
//     fontSize: 24,
//     marginBottom: 16,
//   },
//   button: {
//     marginTop: 16,
//     width: "50%",
//   },
//   listSection: {
//     marginBottom: 16,
//   },
//   totalContainer: {
//     flexDirection: "column",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   totalText: {
//     fontSize: 18,
//     paddingVertical: 4,
//   },
//   saveButton: {
//     marginTop: 15,
//     marginHorizontal: 16,
//   },
// });

// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
// import {
//   Text,
//   Button,
//   List,
//   Divider,
//   useTheme,
//   IconButton,
//   Card,
//   Title,
//   Subheading,
// } from "react-native-paper";
// import { useSelector, useDispatch } from "react-redux";
// import { calculateCarbs, getInsulinDose } from "../utils/nutritionCalculation";
// import { RemoveFoodItem } from "../redux/actions/actionTypes";
// import { fetchFoodItemByIdAPI } from "../redux/actions/actions";
// import axios from "axios";
// import { BASE_URL } from "@env";

// const { width } = Dimensions.get("window");

// const FoodCart = ({ navigation, route }) => {
//   const { tag } = route?.params;
//   const theme = useTheme();
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state.user);
//   const foodData = useSelector((state) => state.api);
//   const foodItems = useSelector((state) => state.addFood);

//   let icr;
//   const totalCarbs =
//     foodItems?.foodItems?.length > 0
//       ? calculateCarbs(foodItems?.foodItems)
//       : 0;

//   if (tag === "Breakfast") {
//     icr = user?.userProfInfo?.userProfData.bfICR;
//   } else if (tag === "Lunch") {
//     icr = user?.userProfInfo?.userProfData.lhICR;
//   } else {
//     icr = user?.userProfInfo?.userProfData.dnICR;
//   }

//   const insulinDose = getInsulinDose(totalCarbs, icr);

//   useEffect(() => {
//     if (foodData?.foodItem?.fdcId && foodData.success) {
//       navigation.navigate("AddFood", {
//         tag: tag,
//         isDelete: true,
//       });
//     }
//   }, [foodData]);

//   const onSave = async () => {
//     let userICR;

//     if (tag === "Breakfast") {
//       userICR = user?.userProfInfo?.userProfData.bfICR;
//     } else if (tag === "Lunch") {
//       userICR = user?.userProfInfo?.userProfData.lhICR;
//     } else {
//       userICR = user?.userProfInfo?.userProfData.dnICR;
//     }

//     let params = {
//       userId: user?.user?.uid,
//       mealItems: foodItems.foodItems,
//       totalCarbs: totalCarbs,
//       mealType: tag,
//       insulinDose: insulinDose,
//       userCRR: user?.userProfInfo?.userProfData.crr,
//       userICR: userICR,
//     };

//     await axios
//       .post(`${BASE_URL}/api/submitData`, params)
//       .then(() => {
//         console.log("Data submitted successfully.");
//         navigation.navigate("HomeScreen");
//       })
//       .catch((e) => console.log("Error: ", e));
//   };

//   const getCarbs = (item) => {
//     let carbs;
//     carbs = item.foodNutrients.find((y) => parseInt(y.number) === 205);
//     return carbs ? carbs.amount : 0;
//   };

//   const handleEditItem = (fdcId) => {
//     const params = {
//       format: "abridged",
//       nutrients:
//         "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
//     };
//     dispatch(fetchFoodItemByIdAPI(params, fdcId, tag));
//   };

//   const handleDeleteItem = (fdcId) => {
//     const updatedArray = foodItems?.foodItems?.filter(
//       (item) => item.fdcId !== fdcId
//     );
//     dispatch(RemoveFoodItem(updatedArray));
//   };

//   const EmptyCart = () => (
//     <View style={styles.emptyCartContainer}>
//       <Text style={styles.emptyMessage}>Your cart is empty!</Text>
//       <Button
//         mode="contained"
//         onPress={() => navigation.goBack()}
//         style={styles.button}
//       >
//         Go Back
//       </Button>
//     </View>
//   );

//   const RightListView = ({ item }) => (
//     <View>
//       <Text style={styles.quantityText}>Quantity: {item?.count}</Text>
//     </View>
//   );

//   const Content = () => (
//     <ScrollView>
//       <View style={styles.contentContainer}>
//         <View style={styles.foodContainer}>
//           <List.Section style={styles.listSection}>
//             <List.Subheader>
//               <Title style={styles.sectionHeader}>My Food Cart</Title>
//             </List.Subheader>
//             {foodItems?.foodItems?.map((item, index) => (
//               <Card key={item.fdcId} style={styles.card}>
//                 <List.Item
//                   key={index}
//                   title={item.description}
//                   description={`Carbs: ${getCarbs(item)}`}
//                   right={() => <RightListView item={item} />}
//                   titleStyle={styles.itemTitle}
//                   descriptionStyle={styles.itemDescription}
//                 />
//                 <View style={styles.actionButtons}>
//                   <IconButton
//                     icon="pencil"
//                     onPress={() => handleEditItem(item.fdcId)}
//                     iconColor={theme.colors.primary}
//                   />
//                   <IconButton
//                     icon="delete"
//                     onPress={() => handleDeleteItem(item.fdcId)}
//                     iconColor={theme.colors.error}
//                   />
//                 </View>
//               </Card>
//             ))}
//           </List.Section>
//         </View>
//         <View style={styles.detailsContainer}>
//           <Card style={styles.detailsCard}>
//             <Card.Content>
//               <Subheading style={styles.totalText}>
//                 Total Carbs: {totalCarbs ? totalCarbs?.toFixed(2) : 0} g
//               </Subheading>
//               <Subheading style={styles.totalText}>
//                 Your Insulin Dose: {insulinDose ? insulinDose : 0} units
//               </Subheading>
//               <Button
//                 onPress={onSave}
//                 mode="contained"
//                 style={styles.saveButton}
//               >
//                 Save
//               </Button>
//             </Card.Content>
//           </Card>
//         </View>
//       </View>
//     </ScrollView>
//   );

//   return (
//     <View style={styles.container}>
//       {foodItems?.foodItems?.length > 0 ? <Content /> : <EmptyCart />}
//     </View>
//   );
// };

// export default FoodCart;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//     backgroundColor: "#f5f5f5",
//   },
//   emptyCartContainer: {
//     justifyContent: "center",
//     flex: 1,
//     alignItems: "center",
//   },
//   emptyMessage: {
//     fontSize: 24,
//     marginBottom: 16,
//     color: "#777",
//   },
//   button: {
//     marginTop: 16,
//     width: "50%",
//     backgroundColor: "#6200ee",
//   },
//   contentContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   foodContainer: {
//     width: "60%",
//   },
//   detailsContainer: {
//     width: "35%",
//   },
//   listSection: {
//     marginBottom: 16,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 6,
//   },
//   sectionHeader: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 8,
//   },
//   card: {
//     marginVertical: 8,
//     borderRadius: 8,
//     padding: 8,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 6,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//   },
//   quantityText: {
//     fontSize: 14,
//     color: "#777",
//   },
//   itemTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   itemDescription: {
//     fontSize: 14,
//     color: "#777",
//   },
//   detailsCard: {
//     borderRadius: 8,
//     padding: 16,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 6,
//   },
//   totalText: {
//     fontSize: 18,
//     paddingVertical: 8,
//     color: "#333",
//   },
//   saveButton: {
//     marginTop: 16,
//     backgroundColor: "#6200ee",
//   },
// });

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Text,
  Button,
  List,
  Divider,
  useTheme,
  IconButton,
  Card,
  Title,
  Subheading,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { calculateCarbs, getInsulinDose } from "../utils/nutritionCalculation";
import { RemoveFoodItem } from "../redux/actions/actionTypes";
import { fetchFoodItemByIdAPI } from "../redux/actions/actions";
import axios from "axios";
import { BASE_URL } from "@env";

const { width } = Dimensions.get("window");

const FoodCart = ({ navigation, route }) => {
  const { tag } = route?.params;
  const theme = useTheme();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const foodData = useSelector((state) => state.api);
  const foodItems = useSelector((state) => state.addFood);

  let icr;
  const totalCarbs =
    foodItems?.foodItems?.length > 0
      ? calculateCarbs(foodItems?.foodItems)
      : 0;

  if (tag === "Breakfast") {
    icr = user?.userProfInfo?.userProfData.bfICR;
  } else if (tag === "Lunch") {
    icr = user?.userProfInfo?.userProfData.lhICR;
  } else {
    icr = user?.userProfInfo?.userProfData.dnICR;
  }

  const insulinDose = getInsulinDose(totalCarbs, icr);

  useEffect(() => {
    if (foodData?.foodItem?.fdcId && foodData.success) {
      navigation.navigate("AddFood", {
        tag: tag,
        isDelete: true,
      });
    }
  }, [foodData]);

  const onSave = async () => {
    let userICR;

    if (tag === "Breakfast") {
      userICR = user?.userProfInfo?.userProfData.bfICR;
    } else if (tag === "Lunch") {
      userICR = user?.userProfInfo?.userProfData.lhICR;
    } else {
      userICR = user?.userProfInfo?.userProfData.dnICR;
    }

    let params = {
      userId: user?.user?.uid,
      mealItems: foodItems.foodItems,
      totalCarbs: totalCarbs,
      mealType: tag,
      insulinDose: insulinDose,
      userCRR: user?.userProfInfo?.userProfData.crr,
      userICR: userICR,
    };

    await axios
      .post(`${BASE_URL}/api/submitData`, params)
      .then(() => {
        console.log("Data submitted successfully.");
        navigation.navigate("HomeScreen");
      })
      .catch(e => console.log("Error: ", e));
  };

  const getCarbs = item => {
    let carbs;
    carbs = item.foodNutrients.find(y => parseInt(y.number) === 205);
    return carbs ? carbs.amount : 0;
  };

  const handleEditItem = fdcId => {
    const params = {
      format: "abridged",
      nutrients:
        "208,204,205,262,203,291,301,302,303,304,305,306,307,601,",
    };
    dispatch(fetchFoodItemByIdAPI(params, fdcId, tag));
  };

  const handleDeleteItem = fdcId => {
    const updatedArray = foodItems?.foodItems?.filter(item => item.fdcId !== fdcId);
    dispatch(RemoveFoodItem(updatedArray));
  };

  const EmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Text style={styles.emptyMessage}>Your cart is empty!</Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go Back
      </Button>
    </View>
  );

  const RightListView = ({ item }) => (
    <View>
      <Text style={styles.quantityText}>Quantity: {item?.count}</Text>
    </View>
  );

  const Content = () => (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.foodContainer}>
          <List.Section style={styles.listSection}>
            <List.Subheader>
              <Title style={styles.sectionHeader}>My Food Cart</Title>
            </List.Subheader>
            {foodItems?.foodItems?.map((item, index) => (
              <Card key={item.fdcId} style={styles.card}>
                <List.Item
                  key={index}
                  title={item.description}
                  description={`Carbs: ${getCarbs(item)}`}
                  right={() => <RightListView item={item} />}
                  titleStyle={styles.itemTitle}
                  descriptionStyle={styles.itemDescription}
                />
                <View style={styles.actionButtons}>
                  <IconButton
                    icon="pencil"
                    onPress={() => handleEditItem(item.fdcId)}
                    iconColor={theme.colors.primary}
                  />
                  <IconButton
                    icon="delete"
                    onPress={() => handleDeleteItem(item.fdcId)}
                    iconColor={theme.colors.error}
                  />
                </View>
              </Card>
            ))}
          </List.Section>
        </View>
        <View style={styles.detailsContainer}>
          <Card style={styles.detailsCard}>
            <Card.Content>
              <Subheading style={styles.totalText}>
                Total Carbs: {totalCarbs ? totalCarbs?.toFixed(2) : 0} g
              </Subheading>
              <Subheading style={styles.totalText}>
                Your Insulin Dose: {insulinDose ? insulinDose : 0} units
              </Subheading>
              <Button
                onPress={onSave}
                mode="contained"
                style={styles.saveButton}
              >
                Save
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("FoodSearch", { tag })}
                style={styles.button}
              >
                Add More Food
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {foodItems?.foodItems?.length > 0 ? <Content /> : <EmptyCart />}
    </View>
  );
};

export default FoodCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f5f5f5",
  },
  emptyCartContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  emptyMessage: {
    fontSize: 24,
    marginBottom: 16,
    color: "#777",
  },
  button: {
    marginTop: 16,
    width: "100%",
    backgroundColor: "#6200ee",
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  foodContainer: {
    width: "60%",
  },
  detailsContainer: {
    width: "35%",
  },
  listSection: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  quantityText: {
    fontSize: 14,
    color: "#777",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDescription: {
    fontSize: 14,
    color: "#777",
  },
  detailsCard: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  totalText: {
    fontSize: 18,
    paddingVertical: 8,
    color: "#333",
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#6200ee",
  },
});
