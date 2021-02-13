import { ApiClient } from "admin-bro";
import { Box } from "@admin-bro/design-system";
import { useEffect, useState } from "react";

const api = new ApiClient();

const StatisticBox = (props) => {
    return (
        <Box variant="white" style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            textAlign: "center"
        }}>
            <p style={{
                fontWeight: "bold",
                fontSize: "3rem",
                marginBottom: "1rem",
                lineHeight: "3rem",
                color: "rgb(96,165,250)"
            }}>{props.number}</p>
            <p>{props.description || "..."}</p>
        </Box>);
};

const Dashboard = () => {
    const [orderData, setOrderData] = useState({});
    const [userDetailsData, setUserDetailsData] = useState({});
    const [plausibleData, setPlausibleData] = useState({});

    useEffect(() => {
        api.resourceAction({ resourceId: "order", actionName: "statistics" }).then(({ data: orderStatistics }) => {
            setOrderData(orderStatistics);
        });
        api.resourceAction({
            resourceId: "user-detail",
            actionName: "statistics"
        }).then(({ data: userDetailStatistics }) => {
            setUserDetailsData(userDetailStatistics);
        });
        api.getDashboard().then(({ data: plausibleStatistics }) => {
            setPlausibleData(plausibleStatistics);
        });
    }, []);

    const gridStyles = `
        .grid {
            display: grid; 
            gap: 1rem;
            margin-bottom: 2rem;
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
 
         @media only screen and (max-width: 600px) {
            .grid {
                grid-template-columns: repeat(1, minmax(0, 1fr));
            }
        }
    `;

    const h1Styles = { fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem", lineHeight: "1.25rem" };

    return (
        <Box variant="grey" style={{ padding: "24px" }}>
            <style>{gridStyles}</style>

            <h1 style={h1Styles}>Bestellungen</h1>
            <div className={"grid"}>
                <StatisticBox description="Bestellungen in den letzten 24 Stunden"
                              number={orderData?.count?.lastDay}/>
                <StatisticBox description="bezahlte Bestellungen in den letzten 24 Stunden"
                              number={orderData?.count?.lastDayPayed}/>
                <StatisticBox description="Bestellungen insgesamt" number={orderData?.count?.all}/>
            </div>

            <h1 style={h1Styles}>Registrierungen</h1>
            <div className={"grid"}>
                <StatisticBox description="Registrierungen in den letzten 24 Stunden"
                              number={userDetailsData?.count?.lastDay}/>
                <StatisticBox description="Registrierungen insgesamt"
                              number={userDetailsData?.count?.all}/>
            </div>

            <h1 style={h1Styles}>plausible.io Daten</h1>
            <div className={"grid"}>
                <StatisticBox description="Pageviews heute"
                              number={plausibleData?.pageviews?.value}/>
                <StatisticBox description="Unique Visitors heute"
                              number={plausibleData?.visitors?.value}/>
            </div>
        </Box>
    );
};

export default Dashboard;