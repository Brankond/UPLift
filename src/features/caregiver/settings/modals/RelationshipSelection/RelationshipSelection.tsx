// external dependencies
import {useContext, useState, useEffect} from 'react';
import {Pressable, SafeAreaView, Text, View} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {Relationship} from '../AddEditEmergencyContact/relationships';
import {RelationshipSelectionModalProps} from 'navigators/navigation-types';
import {SafeAreaContainer, Divider} from 'components';
import {ThemeContext} from 'contexts';
import {RelationshipContext} from '../../../../../navigators/SettingsStackNavigator/SettingsStackNavigator';
import {generalStyles} from 'features/global/Authentication/authStyles';

const keys = Object.keys(Relationship);

const RelationshipSelection = ({
  navigation,
}: RelationshipSelectionModalProps) => {
  const {theme} = useContext(ThemeContext);

  const {relationship, setRelationship} = useContext(RelationshipContext);

  // set header title
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Select Relationship',
    });
  });

  const relationshipList = keys
    .filter(relationshipType => relationshipType !== 'NotSet')
    .map((relationshipType, index) => (
      <Pressable
        key={index}
        onPress={() => {
          if (!setRelationship) return;
          setRelationship(relationshipType);
          if (navigation.canGoBack()) navigation.goBack();
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={[generalStyles(theme).text, {fontSize: 14}]}>
            {relationshipType}
          </Text>
          {relationshipType == relationship && (
            <FeatherIcon name="check" color={theme.colors.primary[400]} />
          )}
        </View>

        {index !== keys.length - 2 && (
          <Divider
            style={{
              marginVertical: theme.sizes[4],
              marginRight: -theme.sizes[5],
            }}
          />
        )}
      </Pressable>
    ));

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        style={{
          marginHorizontal: theme.sizes[4],
          marginTop: theme.sizes[8],
          paddingHorizontal: theme.sizes[5],
          paddingVertical: theme.sizes[4],
          borderRadius: theme.sizes[4],
          backgroundColor: theme.colors.light[50],
        }}>
        {relationshipList}
      </View>
    </SafeAreaView>
  );
};

export {RelationshipSelection};
