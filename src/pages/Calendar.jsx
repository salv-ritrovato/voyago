import { useState } from "react"
import { useGlobal } from "../context/GlobalContext"
import { Link } from "react-router-dom"

export default function Calendar() {
    const { travels } = useGlobal()

    // data di oggi, mi serve per sapere che mese mostrare all'inizio
    const oggi = new Date()
    const [anno, setAnno] = useState(oggi.getFullYear())
    const [mese, setMese] = useState(oggi.getMonth()) // 0 = gennaio

    const nomiMesi = [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ]
    const giorniSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

    // creo un oggetto che per ogni giorno (YYYY-MM-DD) mi dice quali viaggi ci sono
    const viaggiPerGiorno = {}
    travels.forEach(travel => {
        let giorno = new Date(travel.inizio)
        const fine = new Date(travel.fine)
        // ciclo da inizio a fine e segno tutti i giorni
        while (giorno <= fine) {
            const chiave = giorno.toISOString().slice(0, 10)
            if (!viaggiPerGiorno[chiave]) {
                viaggiPerGiorno[chiave] = []
            }
            viaggiPerGiorno[chiave].push(travel)
            giorno.setDate(giorno.getDate() + 1)
        }
    })

    // quanti giorni ha questo mese
    const giorniNelMese = new Date(anno, mese + 1, 0).getDate()
    // in che giorno della settimana parte il mese (0 = domenica, lo trasformo in lun=0)
    let primoGiorno = new Date(anno, mese, 1).getDay()
    primoGiorno = primoGiorno === 0 ? 6 : primoGiorno - 1

    // costruisco le celle: prima quelle vuote, poi i giorni
    const celle = []
    for (let i = 0; i < primoGiorno; i++) {
        celle.push(null)
    }
    for (let g = 1; g <= giorniNelMese; g++) {
        celle.push(g)
    }

    function meseProssimo() {
        if (mese === 11) {
            setMese(0)
            setAnno(anno + 1)
        } else {
            setMese(mese + 1)
        }
    }

    function mesePrecedente() {
        if (mese === 0) {
            setMese(11)
            setAnno(anno - 1)
        } else {
            setMese(mese - 1)
        }
    }

    // mi serve la chiave YYYY-MM-DD di un certo giorno del mese mostrato
    function chiaveGiorno(g) {
        const mm = String(mese + 1).padStart(2, "0")
        const dd = String(g).padStart(2, "0")
        return `${anno}-${mm}-${dd}`
    }

    return (
        <div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <h1 className="maintitle m-0">Calendario</h1>
                <div className="d-flex gap-2 align-items-center justify-content-between w-100 w-sm-auto">
                    <button className="btn btn-turchese" onClick={mesePrecedente}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <span className="fw-bold text-center">{nomiMesi[mese]} {anno}</span>
                    <button className="btn btn-turchese" onClick={meseProssimo}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    {/* griglia a 7 colonne: prima i nomi dei giorni, poi le celle */}
                    <div className="calendario-griglia">
                        {giorniSettimana.map(giorno => (
                            <div key={giorno} className="text-center fw-bold calendario-intestazione">
                                {/* su mobile mostro solo la prima lettera per non sforare */}
                                <span className="d-sm-none">{giorno[0]}</span>
                                <span className="d-none d-sm-inline">{giorno}</span>
                            </div>
                        ))}

                        {celle.map((g, index) => {
                            if (g === null) {
                                return <div key={index}></div>
                            }
                            const chiave = chiaveGiorno(g)
                            const viaggiOggi = viaggiPerGiorno[chiave] || []
                            const ciSonoViaggi = viaggiOggi.length > 0
                            return (
                                <div
                                    key={index}
                                    className={"calendario-cella rounded " + (ciSonoViaggi ? "bg-turchese text-white" : "")}
                                    title={viaggiOggi.map(v => v.destinazione).join(", ")}
                                >
                                    <div className="fw-bold">{g}</div>
                                    {/* su mobile solo un pallino, da tablet in su il nome */}
                                    {ciSonoViaggi && (
                                        <span className="calendario-pallino d-sm-none"></span>
                                    )}
                                    <div className="d-none d-sm-block">
                                        {viaggiOggi.map(v => (
                                            <div key={v.id} className="small text-truncate">
                                                <i className="bi bi-geo-alt"></i> {v.destinazione}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <p className="text-muted small mt-3">
                <i className="bi bi-info-circle me-1"></i>
                I giorni evidenziati sono quelli in cui è fissato un viaggio.
            </p>
        </div>
    )
}
