import { Button, Timeline } from 'flowbite-react';
import { HiArrowNarrowRight } from 'react-icons/hi';

function TimelineFlowbite({ commandes }) {

    if (!commandes || commandes.length === 0) return <p className="text-center">Aucune commande</p>;


    return (
        <Timeline>
            {
                // eslint-disable-next-line react/prop-types
                commandes.map((commande) => (
                    <Timeline.Item key={commande.id}>
                        <Timeline.Point />
                        <Timeline.Content>
                            <Timeline.Time>{commande.date}</Timeline.Time>
                            <Timeline.Title>Commandes</Timeline.Title>
                            <Timeline.Body>
                                {commande.prix}
                            </Timeline.Body>
                            <Button color="gray">
                                Voir plus
                                <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        </Timeline.Content>
                    </Timeline.Item>

                ))
            }
        </Timeline>

    );
}

export default TimelineFlowbite;