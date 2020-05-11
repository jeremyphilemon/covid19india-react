import MapLegend from './maplegend';

import {MAP_META, MAP_STATISTICS, MAP_TYPES, MAP_VIEWS} from '../constants';
import {capitalizeAll} from '../utils/commonfunctions';

import * as d3 from 'd3';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import * as Icon from 'react-feather';
import useSWR from 'swr';
import {useTranslation} from 'react-i18next';
import * as topojson from 'topojson';

const colorInterpolator = (caseType, t) => {
  switch (caseType) {
    case 'confirmed':
      return d3.interpolateReds(t * 0.85);
    case 'active':
      return d3.interpolateBlues(t * 0.85);
    case 'recovered':
      return d3.interpolateGreens(t * 0.85);
    case 'deceased':
      return d3.interpolateGreys(t * 0.85);
    default:
      return;
  }
};

const caseColor = (caseType, alpha = '') => {
  switch (caseType) {
    case 'confirmed':
      return '#ff073a' + alpha;
    case 'active':
      return '#007bff' + alpha;
    case 'recovered':
      return '#28a745' + alpha;
    case 'deceased':
      return '#6c757d' + alpha;
    default:
      return;
  }
};

function ChoroplethMap({
  statistic,
  mapData,
  currentMap,
  changeMap,
  regionHighlighted,
  setRegionHighlighted,
  mapOption,
  isCountryLoaded,
}) {
  const choroplethMap = useRef(null);
  const choroplethLegend = useRef(null);
  const {t} = useTranslation();
  const svgRef = useRef(null);

  const mapMeta = MAP_META[currentMap.name];
  const geoDataResponse = useSWR(mapMeta.geoDataFile, async (file) => {
    return await d3.json(file);
  });

  const colorScale = useMemo(() => {
    if (currentMap.stat === MAP_STATISTICS.ZONE) {
      return d3.scaleOrdinal(
        ['Red', 'Orange', 'Green'],
        ['#d73027', '#fee08b', '#66bd63']
      );
    } else {
      return d3
        .scaleSequential([0, Math.max(1, statistic[mapOption].max)], (t) =>
          colorInterpolator(mapOption, t)
        )
        .clamp(true);
    }
  }, [currentMap.stat, statistic, mapOption]);

  useEffect(() => {
    if (!geoDataResponse.data) return;
    const geoData = geoDataResponse.data;

    const topology =
      currentMap.view === MAP_VIEWS.STATES
        ? topojson.feature(geoData, geoData.objects[mapMeta.graphObjectStates])
        : topojson.feature(
            geoData,
            geoData.objects[mapMeta.graphObjectDistricts]
          );

    const svg = d3.select(svgRef.current);

    if (!svg.attr('viewBox')) {
      const [widthStyle, heightStyle] = [
        parseInt(svg.style('width')),
        parseInt(svg.style('height')),
      ];
      const projection = isCountryLoaded
        ? d3.geoMercator().fitWidth(widthStyle, topology)
        : d3.geoMercator().fitSize([widthStyle, heightStyle], topology);
      const path = d3.geoPath(projection);
      const bBox = path.bounds(topology);
      const [width, height] = [+bBox[1][0], bBox[1][1]];
      svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
    const bBox = svg.attr('viewBox').split(' ');
    const [width, height] = [+bBox[2], +bBox[3]];

    const projection = d3.geoMercator().fitSize([width, height], topology);
    const path = d3.geoPath(projection);

    // Add id to each feature
    const features = topology.features.map((f) => {
      const district = f.properties.district;
      const state = f.properties.st_nm;
      const obj = Object.assign({}, f);
      obj.id = `${currentMap.name}-${state}${district ? '-' + district : ''}`;
      return obj;
    });

    /* Draw map */
    const t = d3.transition().duration(500);
    let onceTouchedRegion = null;
    const regionSelection = svg
      .select('.regions')
      .selectAll('path')
      .data(features, (d) => d.id)
      .join((enter) => {
        const sel = enter
          .append('path')
          .attr('d', path)
          .style('cursor', 'pointer')
          .on('mouseenter', (d) => {
            const region = {state: d.properties.st_nm};
            if (d.properties.district) region.district = d.properties.district;
            setRegionHighlighted(region);
          })
          .on('mouseleave', (d) => {
            if (onceTouchedRegion === d) onceTouchedRegion = null;
          })
          .on('touchstart', (d) => {
            if (onceTouchedRegion === d) onceTouchedRegion = null;
            else onceTouchedRegion = d;
          })
          .on('click', (d) => {
            d3.event.stopPropagation();
            if (onceTouchedRegion || mapMeta.mapType === MAP_TYPES.STATE)
              return;
            // Disable pointer events till the new map is rendered
            svg.attr('pointer-events', 'none');
            svg.selectAll('.path-region').attr('pointer-events', 'none');
            // Switch map
            changeMap(d.properties.st_nm);
          });
        sel.append('title');
        return sel;
      })
      .attr('class', function () {
        const isHovered = d3.select(this).classed('map-hover');
        return `path-region ${mapOption} ${isHovered ? 'map-hover' : ''}`;
      })
      .attr('pointer-events', 'none');

    regionSelection
      .transition(t)
      .attr('fill', (d) => {
        let n;
        if (currentMap.stat === MAP_STATISTICS.ZONE) {
          const state = d.properties.st_nm;
          const district = d.properties.district;
          n =
            mapData[state] && mapData[state][district]
              ? mapData[state][district]
              : 0;
        } else {
          const state = d.properties.st_nm;
          const district = d.properties.district;
          if (district)
            n =
              mapData[state] &&
              mapData[state][district] &&
              mapData[state][district][mapOption]
                ? mapData[state][district][mapOption]
                : 0;
          else
            n =
              mapData[state] && mapData[state][mapOption]
                ? mapData[state][mapOption]
                : 0;
        }
        const color = n === 0 ? '#ffffff00' : colorScale(n);
        return color;
      })
      .attr('stroke', function () {
        const isHovered = d3.select(this).classed('map-hover');
        if (isHovered) this.parentNode.appendChild(this);
        if (currentMap.stat === MAP_STATISTICS.ZONE) {
          return isHovered ? '#343a40' : null;
        } else {
          return isHovered ? caseColor(mapOption) : null;
        }
      })
      .on('end', function () {
        d3.select(this).attr('pointer-events', 'all');
      });

    regionSelection.select('title').text((d) => {
      if (currentMap.stat === MAP_STATISTICS.TOTAL) {
        const state = d.properties.st_nm;
        const district = d.properties.district;
        let n;
        if (district)
          n =
            mapData[state] && mapData[state][district]
              ? mapData[state][district][mapOption]
              : 0;
        else n = mapData[state] ? mapData[state][mapOption] : 0;
        return (
          Number(
            parseFloat(
              100 * (n / (statistic[mapOption].total || 0.001))
            ).toFixed(2)
          ).toString() +
          '% from ' +
          capitalizeAll(district ? district : state)
        );
      }
    });

    svg
      .transition()
      .duration(mapMeta.mapType === MAP_TYPES.STATE ? t.duration() / 2 : 0)
      .on('end', () =>
        svg.attr('class', currentMap.stat === MAP_STATISTICS.ZONE ? 'zone' : '')
      );

    let meshStates = [];
    if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
      meshStates = [
        topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectStates]),
      ];
      meshStates[0].id = mapMeta.graphObjectStates;
    }
    let meshDistricts = [];
    if (currentMap.view === MAP_VIEWS.DISTRICTS) {
      // Add id to mesh
      meshDistricts = [
        topojson.mesh(geoData, geoData.objects[mapMeta.graphObjectDistricts]),
      ];
      meshDistricts[0].id = mapMeta.graphObjectDistricts;
    }

    svg
      .select(
        currentMap.view === MAP_VIEWS.STATES
          ? '.state-borders'
          : '.district-borders'
      )
      .selectAll('path')
      .data(
        currentMap.view === MAP_VIEWS.STATES ? meshStates : meshDistricts,
        (d) => d.id
      )
      .join((enter) =>
        enter
          .append('path')
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke-width', function () {
            return mapMeta.mapType === MAP_TYPES.COUNTRY &&
              currentMap.view === MAP_VIEWS.DISTRICTS
              ? 0
              : width / 250;
          })
      )
      .transition(t)
      .attr('stroke', () => {
        if (currentMap.stat === MAP_STATISTICS.ZONE) {
          return '#00000060';
        } else {
          return caseColor(mapOption, '30');
        }
      });

    svg
      .select(
        currentMap.view === MAP_VIEWS.STATES
          ? '.district-borders'
          : '.state-borders'
      )
      .selectAll('path')
      .data(
        currentMap.view === MAP_VIEWS.STATES ? meshDistricts : meshStates,
        (d) => d.id
      )
      .join((enter) =>
        enter
          .append('path')
          .attr('d', path)
          .attr('fill', 'none')
          .attr('stroke-width', width / 250)
      )
      .transition(t)
      .attr('stroke', '#343a4099');

    // Reset on tapping outside map
    svg.attr('pointer-events', 'auto').on('click', () => {
      if (mapMeta.mapType !== MAP_TYPES.STATE) {
        setRegionHighlighted({
          state: 'Total',
        });
      }
    });
  }, [
    geoDataResponse.data,
    mapMeta,
    currentMap,
    setRegionHighlighted,
    changeMap,
    isCountryLoaded,
    colorScale,
    statistic,
    mapData,
    mapOption,
  ]);

  const highlightRegionInMap = useCallback(
    (region) => {
      const paths = d3.selectAll('.path-region');
      paths.attr('stroke', null);
      paths.classed('map-hover', (d, i, nodes) => {
        if (
          region.district === d.properties?.district &&
          region.state === d.properties.st_nm
        ) {
          nodes[i].parentNode.appendChild(nodes[i]);
          d3.select(nodes[i]).attr('stroke', function (d) {
            if (currentMap.stat === MAP_STATISTICS.ZONE) return '#343a40';
            else
              return d3.select(this).classed('confirmed')
                ? caseColor('confirmed')
                : d3.select(this).classed('active')
                ? caseColor('active')
                : d3.select(this).classed('recovered')
                ? caseColor('recovered')
                : d3.select(this).classed('deceased')
                ? caseColor('deceased')
                : null;
          });
          return true;
        }
        return false;
      });
    },
    [currentMap.stat]
  );

  useEffect(() => {
    highlightRegionInMap(regionHighlighted);
  }, [highlightRegionInMap, regionHighlighted]);

  return (
    <React.Fragment>
      <div className="svg-parent fadeInUp" style={{animationDelay: '2.5s'}}>
        <svg id="chart" preserveAspectRatio="xMidYMid meet" ref={svgRef}>
          <g className="regions" />
          <g className="state-borders" />
          <g className="district-borders" />
        </svg>
        {mapMeta.mapType === MAP_TYPES.STATE &&
        mapData[currentMap.name]?.Unknown &&
        mapData[currentMap.name]?.Unknown[mapOption] ? (
          <div className="disclaimer">
            <Icon.AlertCircle />
            {t('District-wise {{mapOption}} numbers are under reconciliation', {
              mapOption: t(mapOption),
            })}
          </div>
        ) : (
          ''
        )}
      </div>

      {colorScale && (
        <MapLegend
          colorScale={colorScale}
          statistic={statistic}
          mapStatistic={currentMap.stat}
          mapOption={mapOption}
        />
      )}

      <svg style={{position: 'absolute', height: 0}}>
        <defs>
          <filter id="balance-color" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.91372549  0           0            0  0.08627451
                      0           0.91372549  0            0  0.08627451
                      0           0           0.854901961  0  0.145098039
                      0           0           0            1  0"
            />
          </filter>
        </defs>
      </svg>
    </React.Fragment>
  );
}

export default ChoroplethMap;
