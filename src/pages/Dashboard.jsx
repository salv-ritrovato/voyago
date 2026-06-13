import { useGlobal } from "../context/GlobalContext"
import { Link } from "react-router-dom"

export default function Dashboard() {
    const { travels } = useGlobal()

    // numero di viaggi attivi
    const numeroViaggi = travels.length

    // totale partecipanti: sommo i partecipanti di ogni viaggio
    let totalePartecipanti = 0
    travels.forEach(travel => {
        totalePartecipanti = totalePartecipanti + travel.partecipanti.length
    })

    // media partecipanti per viaggio (occhio alla divisione per zero)
    let mediaPartecipanti = 0
    if (numeroViaggi > 0) {
        mediaPartecipanti = Math.round(totalePartecipanti / numeroViaggi)
    }

    // prossimo viaggio in partenza: prendo quelli che iniziano da oggi in poi
    // e mi tengo quello con la data piu' vicina
    const oggi = new Date()
    let prossimoViaggio = null
    travels.forEach(travel => {
        const inizio = new Date(travel.inizio)
        if (inizio >= oggi) {
            if (prossimoViaggio === null || inizio < new Date(prossimoViaggio.inizio)) {
                prossimoViaggio = travel
            }
        }
    })

    return (
        <div>
            <h1 className="maintitle mb-4">Pannello di Controllo</h1>

            {/* card statistiche, mobile first: una colonna su mobile, piu' colonne da sm in su */}
            <div className="row g-3 g-md-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-geo-alt-fill fs-2 text-turquoise"></i>
                            <h2 className="fw-bold mt-2 mb-0">{numeroViaggi}</h2>
                            <p className="text-muted mb-0">Viaggi attivi</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-people-fill fs-2 text-turquoise"></i>
                            <h2 className="fw-bold mt-2 mb-0">{totalePartecipanti}</h2>
                            <p className="text-muted mb-0">Partecipanti totali</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-bar-chart-fill fs-2 text-turquoise"></i>
                            <h2 className="fw-bold mt-2 mb-0">{mediaPartecipanti}</h2>
                            <p className="text-muted mb-0">Media per viaggio</p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body text-center">
                            <i className="bi bi-airplane-fill fs-2 text-turquoise"></i>
                            {prossimoViaggio ? (
                                <>
                                    <h5 className="fw-bold mt-2 mb-0">{prossimoViaggio.destinazione}</h5>
                                    <p className="text-muted mb-2 small">
                                        <i className="bi bi-calendar3 me-1"></i>
                                        {prossimoViaggio.inizio}
                                    </p>
                                    <Link to={`/travel/${prossimoViaggio.id}`}>
                                        <button className="btn btn-turchese btn-sm rounded-pill">
                                            Dettagli
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <p className="text-muted mt-2 mb-0">Nessun viaggio in programma</p>
                            )}
                            <p className="text-muted mb-0 mt-2 small">Prossima partenza</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
