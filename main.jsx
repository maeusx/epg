import React from 'react'
import ReactDOM from 'react-dom/client'
import { useState, useEffect, useRef } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [card, setCard] = useState('')
  const [show, setShow] = useState(false)
  const elementRef = useRef(null)
  const rn = '\r\n'
  let today = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString().slice(0, -5).replace(/-|T|:/g, '')
  let tomorrow = new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString().slice(0, -5).replace(/-|T|:/g, '')

  const handleHorizantalScroll = (element, speed, distance, step) => {
    let scrollAmount = 0
    const slideTimer = setInterval(() => {
      element.scrollLeft += step
      scrollAmount += Math.abs(step)
      if (scrollAmount >= distance) {
        clearInterval(slideTimer)
      }
    }, speed)
  }

  useEffect(() => {
    try {
      const getChannels = async () => {
        const response = await fetch(
          `https://mfwkweb-api.clarovideo.net/services/epg/channel?device_id=web&device_category=web&device_model=web&device_type=web&device_so=Chrome&format=json&device_manufacturer=generic&authpn=webclient&authpt=tfg1h3j4k6fd7&api_version=v5.93&region=argentina&HKS=web61144bb49d549&user_id=54343080&date_from=${today}&date_to=${tomorrow}&quantity=50`,
        )
        const data = await response.json()
        setData(data.response.channels)
      }
      getChannels()
    } catch {
      console.log('API ERROR')
    }
  }, [])

  function handleHover(e) {
    setCard(e.target.textContent)
  }

  return (
    <>
      {show ? (
        <div className="container">
          <div className="hide-button" onClick={() => setShow((prevShow) => !prevShow)}>
            ✕
          </div>
          <div className="card-info">{card && <div>{card}</div>}</div>
          <div className="button-container">
            <button
              onClick={() => {
                handleHorizantalScroll(elementRef.current, 10, 300, -20)
              }}>
              ‹
            </button>
            <button
              onClick={() => {
                handleHorizantalScroll(elementRef.current, 10, 300, 20)
              }}>
              ›
            </button>
          </div>
          <div className="channel-guide" ref={elementRef}>
            <ul className="channels">
              {data &&
                data.map((item) => {
                  return (
                    <li key={item.id}>
                      <div className="channel-info">
                        <div className="channel-number">{item.number}</div>
                        <div className="channel-img">
                          <img src={item.image} />
                        </div>
                      </div>
                      <div>
                        <div className="program-info">
                          {item.events.map((event, index) => {
                            return (
                              <div
                                key={index}
                                className="program"
                                style={{ width: `${((event.unix_end - event.unix_begin) / 36) * 4}px` }}
                                onMouseEnter={(e) => handleHover(e)}>
                                <strong>{event.name}</strong>
                                <br />
                                {rn}
                                {event.date_begin.split(' ').pop().slice(0, -3) + 'hrs'} –{' '}
                                {event.date_end.split(' ').pop().slice(0, -3) + 'hrs'}
                                <br />
                                {rn}
                                <span className="hidden">{event.description}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
      ) : (
        <div className="show-button">
          <button onClick={() => setShow((prevShow) => !prevShow)}>Show EPG</button>
        </div>
      )}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
