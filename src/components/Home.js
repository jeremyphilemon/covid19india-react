import {API_ROOT_URL, GOSPEL_DATE} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import useStickySWR from '../hooks/useStickySWR';
import {fetcher} from '../utils/commonFunctions';

import classnames from 'classnames';
import {useState, useRef, lazy, Suspense} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation} from 'react-router-dom';
import {useLocalStorage, useSessionStorage, useWindowSize} from 'react-use';

const Actions = lazy(() => import('./Actions'));
const Footer = lazy(() => import('./Footer'));
const Level = lazy(() => import('./Level'));
const LevelVaccinated = lazy(() => import('./LevelVaccinated'));
const MapExplorer = lazy(() => import('./MapExplorer'));
const MapSwitcher = lazy(() => import('./MapSwitcher'));
const Minigraphs = lazy(() => import('./Minigraphs'));
const Search = lazy(() => import('./Search'));
const StateHeader = lazy(() => import('./StateHeader'));
const Table = lazy(() => import('./Table'));
const TimeseriesExplorer = lazy(() => import('./TimeseriesExplorer'));

function Home() {
  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

  const [anchor, setAnchor] = useLocalStorage('anchor', null);
  const [expandTable, setExpandTable] = useLocalStorage('expandTable', false);
  const [mapStatistic, setMapStatistic] = useSessionStorage(
    'mapStatistic',
    'active'
  );
  const [date, setDate] = useState('');
  const location = useLocation();

  const {data: timeseries} = useStickySWR(
    `${API_ROOT_URL}/timeseries.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const {data} = useStickySWR(
    `${API_ROOT_URL}/data${date ? `-${date}` : ''}.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    }
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();

  const districtDataAvailable = date === '' || date >= GOSPEL_DATE;

  return (
    <>
      <Helmet>
        <title>Coronavirus Outbreak in India - covid19india.org</title>
        <meta
          name="title"
          content="Coronavirus Outbreak in India: Latest Map and Case Count"
        />
      </Helmet>

      <div className="Home">
        <div className={classnames('home-left', {expanded: expandTable})}>
          <div className="header">
            <Suspense fallback={<div />}>
              <Search />
            </Suspense>

            {timeseries && (
              <Suspense fallback={<div style={{minHeight: '56px'}} />}>
                <Actions
                  {...{
                    date,
                    setDate,
                    dates: Object.keys(timeseries['TT']?.dates).reverse(),
                  }}
                />
              </Suspense>
            )}
          </div>

          <div style={{position: 'relative', marginTop: '1rem'}}>
            {data && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                {width > 769 && !expandTable && (
                  <MapSwitcher {...{mapStatistic, setMapStatistic}} />
                )}
                <Level data={data['TT']} />
              </Suspense>
            )}

            {timeseries && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                <Minigraphs timeseries={timeseries['TT']?.dates} {...{date}} />
              </Suspense>
            )}
          </div>

          {data && <LevelVaccinated data={data['TT']} />}

          {data && (
            <Suspense fallback={<div />}>
              <Table
                {...{
                  data,
                  regionHighlighted,
                  setRegionHighlighted,
                  expandTable,
                  setExpandTable,
                  districtDataAvailable,
                }}
              />
            </Suspense>
          )}
        </div>

        <div
          className={classnames('home-right', {expanded: expandTable})}
          ref={homeRightElement}
        >
          {(isVisible || location.hash) && (
            <>
              {data && (
                <div
                  className={classnames('map-container', {
                    expanded: expandTable,
                  })}
                >
                  <Suspense fallback={<div style={{height: '50rem'}} />}>
                    <StateHeader data={data['TT']} stateCode={'TT'} />
                    <MapExplorer
                      stateCode="TT"
                      {...{date, data}}
                      {...{mapStatistic, setMapStatistic}}
                      {...{regionHighlighted, setRegionHighlighted}}
                      {...{anchor, setAnchor}}
                      {...{expandTable, districtDataAvailable}}
                    />
                  </Suspense>
                </div>
              )}

              {timeseries && (
                <Suspense fallback={<div />}>
                  <TimeseriesExplorer
                    stateCode="TT"
                    {...{
                      timeseries,
                      date,
                      regionHighlighted,
                      setRegionHighlighted,
                      anchor,
                      setAnchor,
                      expandTable,
                    }}
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>

      {isVisible && (
        <Suspense fallback={<div />}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}

export default Home;
