import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { PRHeader } from '../components/ui/PRHeader';
import { MobileMumbaiMap } from '../components/map/MobileMumbaiMap';
import { BottomSheet } from '../components/ui/BottomSheet';
import { fetchZones } from '../api/city';
import { ZoneSummary } from '../types';

export const MapScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [zones, setZones] = useState<ZoneSummary[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZoneSummary | null>(null);
  const [sheetVisible, setSheetVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchZones().then(res => {
      if (res.data?.zones) {
        setZones(res.data.zones);
        // If route passed a specific zoneId, open it
        const targetId = route?.params?.zoneId;
        if (targetId) {
          const matched = res.data.zones.find((z: any) => z.id === targetId);
          if (matched) {
            setSelectedZone(matched);
            setSheetVisible(true);
          }
        }
      }
    });
  }, [route?.params?.zoneId]);

  const handleSelectZone = (zone: ZoneSummary) => {
    setSelectedZone(zone);
    setSheetVisible(true);
  };

  const handleRouteToZone = () => {
    if (selectedZone) {
      navigation.navigate('Journey', {
        destinationId: selectedZone.id === 'curry-road' ? 'lalbaugcha-raja' : selectedZone.id,
      });
    }
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="Live Mumbai Flow Map"
        subtitle="OpenStreetMap Telemetry &middot; Zero API Key"
      />

      <MobileMumbaiMap
        zones={zones}
        onSelectZone={handleSelectZone}
        style={styles.map}
      />

      {/* Floating Interactive Bottom Sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title={selectedZone?.name || 'Monitored Zone'}
        subtitle={`Central Mumbai Administrative Corridor`}
        pressure={selectedZone?.pressure}
        status={selectedZone?.level}
        expectedNext={
          selectedZone?.pressure
            ? `${selectedZone.pressure >= 85 ? selectedZone.pressure + 6 : selectedZone.pressure + 4}% (+30m)`
            : undefined
        }
        details={
          selectedZone?.pressure && selectedZone.pressure >= 85
            ? 'Critical saturation detected on platform and pedestrian bridges. High congestion risk.'
            : 'Normal transit flow. Corridor operating within safe capacity limits.'
        }
        onActionPress={handleRouteToZone}
        actionTitle={`Transit Directions to ${selectedZone?.name?.split(' ')[0] || 'Zone'}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
});
