import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors, spacing, shadows } from '../../theme';
import { ZoneSummary } from '../../types';

interface MobileMapProps {
  zones?: ZoneSummary[];
  activeLayer?: 'CROWD' | 'TRANSPORT' | 'DISRUPTIONS' | 'ACTION';
  onSelectZone?: (zone: ZoneSummary) => void;
  style?: ViewStyle;
}

const DEFAULT_ZONES: ZoneSummary[] = [
  { id: 'curry-road', name: 'Curry Road Station', pressure: 94, level: 'CRITICAL', lat: 18.9942, lng: 72.8331 },
  { id: 'lalbaug', name: 'Lalbaugcha Raja Core', pressure: 96, level: 'CRITICAL', lat: 18.9912, lng: 72.8365 },
  { id: 'dadar', name: 'Dadar Central Interchange', pressure: 78, level: 'HIGH', lat: 19.0178, lng: 72.8478 },
  { id: 'parel', name: 'Parel Central Hub', pressure: 86, level: 'CRITICAL', lat: 19.0005, lng: 72.8390 },
  { id: 'girgaon', name: 'Girgaon Chowpatty', pressure: 48, level: 'MODERATE', lat: 18.9542, lng: 72.8122 },
  { id: 'thane', name: 'Thane Suburban Hub', pressure: 24, level: 'LOW', lat: 19.1860, lng: 72.9759 },
  { id: 'andheri', name: 'Andhericha Raja', pressure: 52, level: 'MODERATE', lat: 19.1245, lng: 72.8368 },
];

export const MobileMumbaiMap: React.FC<MobileMapProps> = ({
  zones = DEFAULT_ZONES,
  activeLayer = 'CROWD',
  onSelectZone,
  style,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [currentLayer, setCurrentLayer] = useState<'CROWD' | 'TRANSPORT' | 'DISRUPTIONS' | 'ACTION'>(activeLayer);

  // Generate Leaflet Map HTML with OpenStreetMap Tiles (0 API keys, 0 watermarks)
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #F5F3EE; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .custom-pin {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-weight: 800;
            font-size: 11px;
            border-radius: 8px;
            padding: 3px 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 1.5px solid #FFFFFF;
            white-space: nowrap;
          }
          .pin-critical { background: #DC2626; }
          .pin-high { background: #E69A2E; }
          .pin-moderate { background: #D97706; }
          .pin-low { background: #0D9488; }
          .disruption-line { stroke: #DC2626; stroke-width: 5; stroke-dasharray: 6, 6; }
          .action-line { stroke: #0D9488; stroke-width: 5; stroke-dasharray: 8, 4; }
          .rail-line { stroke: #2563EB; stroke-width: 4; }
          .leaflet-control-attribution { font-size: 9px !important; background: rgba(255,255,255,0.8) !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            center: [18.995, 72.84],
            zoom: 12,
            zoomControl: false,
            attributionControl: true
          });

          // OpenStreetMap Standard Tiles (No API key required)
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);

          const zonesData = ${JSON.stringify(zones)};
          const layerMode = '${currentLayer}';

          // Add Disruption Line (Curry Road - Parel)
          if (layerMode === 'DISRUPTIONS' || layerMode === 'CROWD') {
            L.polyline([[18.9942, 72.8331], [19.0005, 72.8390]], {
              color: '#DC2626',
              weight: 6,
              dashArray: '6, 6',
              opacity: 0.9
            }).addTo(map);
          }

          // Add Redirection Line (Dadar to Thane Buffer)
          if (layerMode === 'ACTION') {
            L.polyline([[19.0178, 72.8478], [19.1860, 72.9759]], {
              color: '#0D9488',
              weight: 6,
              dashArray: '8, 4',
              opacity: 0.9
            }).addTo(map);
          }

          // Add Rail Lines
          if (layerMode === 'TRANSPORT') {
            L.polyline([[18.940, 72.835], [19.0178, 72.8478], [19.1860, 72.9759]], {
              color: '#2563EB',
              weight: 4,
              opacity: 0.8
            }).addTo(map);
          }

          // Add Hotspot Zone Markers
          zonesData.forEach(z => {
            if (!z.lat || !z.lng) return;
            const cls = z.pressure >= 85 ? 'pin-critical' : z.pressure >= 60 ? 'pin-high' : z.pressure >= 40 ? 'pin-moderate' : 'pin-low';
            
            const icon = L.divIcon({
              className: 'custom-div-icon',
              html: '<div class="custom-pin ' + cls + '">' + z.name.split(' ')[0] + ' ' + z.pressure + '%</div>',
              iconSize: [80, 26],
              iconAnchor: [40, 13]
            });

            const marker = L.marker([z.lat, z.lng], { icon: icon }).addTo(map);
            marker.on('click', () => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_ZONE', zone: z }));
              }
            });
          });

          window.recenterMap = function() {
            map.setView([18.995, 72.84], 12);
          };
          window.zoomInMap = function() { map.zoomIn(); };
          window.zoomOutMap = function() { map.zoomOut(); };
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_ZONE' && data.zone && onSelectZone) {
        onSelectZone(data.zone);
      }
    } catch (e) {
      console.warn('Map message parse error:', e);
    }
  };

  const handleZoomIn = () => {
    webViewRef.current?.injectJavaScript('window.zoomInMap && window.zoomInMap(); true;');
  };

  const handleZoomOut = () => {
    webViewRef.current?.injectJavaScript('window.zoomOutMap && window.zoomOutMap(); true;');
  };

  const handleRecenter = () => {
    webViewRef.current?.injectJavaScript('window.recenterMap && window.recenterMap(); true;');
  };

  return (
    <View style={[styles.container, style]}>
      {/* Map Layer Chips Bar */}
      <View style={styles.layerBar}>
        {(['CROWD', 'TRANSPORT', 'DISRUPTIONS', 'ACTION'] as const).map(layer => {
          const isActive = currentLayer === layer;
          return (
            <TouchableOpacity
              key={layer}
              onPress={() => setCurrentLayer(layer)}
              style={[styles.layerChip, isActive && styles.activeLayerChip]}
              activeOpacity={0.7}
            >
              <Text style={[styles.layerChipText, isActive && styles.activeLayerChipText]}>
                {layer === 'CROWD' && '👥 Crowd'}
                {layer === 'TRANSPORT' && '🚆 Trains'}
                {layer === 'DISRUPTIONS' && '⚠️ Blocks'}
                {layer === 'ACTION' && '⚡ Action'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Embedded Leaflet Map */}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={handleMessage}
        style={styles.webView}
        scrollEnabled={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* Floating Map Zoom Controls */}
      <View style={[styles.controlsBox, shadows.card]}>
        <TouchableOpacity style={styles.controlBtn} onPress={handleZoomIn} activeOpacity={0.7}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
        <View style={styles.controlDivider} />
        <TouchableOpacity style={styles.controlBtn} onPress={handleZoomOut} activeOpacity={0.7}>
          <Text style={styles.controlText}>−</Text>
        </TouchableOpacity>
        <View style={styles.controlDivider} />
        <TouchableOpacity style={styles.controlBtn} onPress={handleRecenter} activeOpacity={0.7}>
          <Text style={styles.controlTextSmall}>🎯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  layerBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 6,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  layerChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: spacing.radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSecondary,
  },
  activeLayerChip: {
    backgroundColor: colors.navy,
  },
  layerChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeLayerChipText: {
    color: colors.textWhite,
  },
  webView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  controlsBox: {
    position: 'absolute',
    right: 14,
    bottom: 24,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    zIndex: 10,
  },
  controlBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  controlTextSmall: {
    fontSize: 14,
  },
  controlDivider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.borderLight,
  },
});
