<template>
  <div class="about-page container">
    <div class="jumbotron">
        <h1>
            Acerca de Carpoolear
        </h1>
    </div>
    <p class="lead">
        Carpoolear es un proyecto de <a href="http://www.stsrosario.org.ar/" target="_blank"><abbr title="Soluciones Tecnológicas Sustentables">STS</abbr> Rosario</a>. El objetivo de STS Rosario en el que fundamentalmente se enmarca este proyecto es el de minimizar el impacto ambiental de nuestras actividades cotidianas.
    </p>
    <h2>Misión</h2>
    <p>El objetivo de Carpoolear es masificar la práctica de carpooling e incentivar el uso racional y eficiente del automóvil como modo de transporte. Con ello se busca lograr disminuir:</p>


    <ul class="list">

        <li>Las emisiones de gases causantes del aumento del efecto invernadero en nuestra atmósfera.</li>

        <li>El consumo de combustibles fósiles (recursos no renovables).</li>

        <li>Las congestiones de tránsito que ocasionan grandes pérdidas de tiempo.</li>

        <li>Los niveles de smog y ruido en las urbes, causantes de enfermedades.</li>

        <li>La probabilidad de accidentes de tránsito, con el consecuente descenso en la mortalidad.</li>

    </ul>



    <p>Para lograr esto, hemos desarrollado una plataforma gratuita, colaborativa y sin fines de lucro donde las personas pueden compartir con otras sus viajes en auto. </p>



    <h2 id="carpoolearmas">¿Cómo impacta Carpoolear a nuestras vidas?</h2>

    <p>
        Cuando una persona carpoolea ocurren varios hechos en simultáneo que afectan la vida de esa persona y la de otros.
    </p>

    <p>
        En primer lugar, uno de los mayores impactos positivos de Carpoolear es reforzar los lazos sociales. Al compartir un viaje, personas que muchas veces no se conocían entre sí, generan un vínculo a través de las charlas del viaje. Surgiendo posibilidades de trabajo y nuevos contactos, intercambiando puntos de vista sobre distintos temas, generando confianza entre la gente, formando hasta un sentimiento de “comunidad carpoolera”. Esto va logrando un cambio cultural frente a las personas desconocidas, además de viajes mucho más entretenidos y divertidos.
    </p>

    <p>
        En segundo lugar, la práctica del carpooling genera un impacto ambiental positivo cuando dos conductores de automóviles que habitualmente viajan en autos separados deciden unirse y viajar en un mismo vehículo dejando el otro guardado en el garage. Si esto se hace habitual en las personas podríamos reducir la cantidad de autos circulantes y así disminuir también el tiempo de viaje, las emisiones de gases de efecto invernadero, el consumo de combustibles fósiles (recursos no renovables), el smog y la contaminación sonora que provocan los vehículos, entre otros beneficios.
    </p>

    <p>
        La mayoría de los viajes que se cargan actualmente en la plataforma no generan un impacto ambiental directo. Los mismos son viajes interurbanos que se realizan ocasionalmente los fines de semana. Sin embargo, sirven para que las personas conozcan la práctica, se animen a viajar con desconocidos y encuentren una nueva forma de viaje. En un futuro, cuando se logre que la práctica se vuelva masiva, esperamos que las personas consideren el compartir el auto como algo viable para aplicar tanto en sus viajes ocasionales de fin de semana como a los de rutina, ir al trabajo, escuela, etc. También esperamos que más conductores se dejen llevar en auto ajeno y dejen el suyo guardado.
    </p>

    <p>
        En tercer lugar, compartir el auto implica un beneficio económico para los viajeros. Cuando se finaliza un viaje se calcula el costo de combustible y peajes y se divide por la cantidad de ocupantes del vehículo. Entonces, cuando aumenta el número de ocupantes, se disminuye el costo del viaje y el mismo se vuelve más accesible.
    </p>

    <p>
        El carpooling tiene diferentes impactos positivos sobre la sociedad, alienta la sociabilización entre desconocidos, disminuye la cantidad de autos circulantes con los beneficios que esto significa y representa un beneficio económico para los usuarios. Por eso creemos importante alentar esta práctica y concientizar a las personas para que hagan un uso más racional del automóvil.
    </p>



    <h2>Impacto ambiental</h2>

    <p>
        Cada vez que dos automovilistas deciden compartir el viaje en un solo vehículo, se evitan – en promedio, por kilómetro recorrido – la emisión de 150 gr de CO<sub>2</sub> a la atmósfera, uno de los principales gases que contribuyen al efecto invernadero, y el consumo de 0,071 litros de nafta, fuente de energía no renovable y que por ello debe utilizarse de forma racional.
    </p>



    <h2>Premios</h2>

    <ul class="list">

        <li>Ashoka - “Avancemos” (2011 y 2012)</li>

        <li>Gobierno de la Provincia de Santa Fe - “Ingenia 3” (2012)</li>

        <li>Seleccionado por el Programa “Jóvenes Líderes Emprendedores Sociales” (Ashoka Avancemos-SAP) (2012)</li>

        <li>1º Mención del Premio Schiffrin, 12ª Convocatoria “Innovación por el Ambiente” de la fundación FARN Argentina (2013)</li>

        <li>Espacio Santafesino (2016)</li>

    </ul>
    <div aria-hidden="true" style="cursor: default;">_____________________________</div>

    <img class="img-ES" src="/static/img/espacio_santafesino.jpg" alt="Realizado con el apoyo de Espacio Santafesino, Ministerio de Innovación y Cultura de Santa Fe. Convocatoria 2016." />



  </div>
</template>
<style scoped>
    .about-page {
        background: white;
        border-radius: 8px;
        box-shadow: 0 0 5px 6px #CCC;
        margin: 3em auto;
        padding: 2em;
    }
    @media (max-width: 767px) {
        .about-page {
            box-shadow: none;
            margin: 0 auto;
        }
    }
    h1 {
        color: #E0191C;
    }
    .list {
        color: #555555;
        list-style-type: circle;
        padding-left: 40px;
    }
    h2 {
        color: #016386;
    }
    .img-ES {
        max-width: 100%;
    }
</style>


<script>
import bus from '../../services/bus-event.js';

export default {
    name: 'about',
    data () {
        return {
        };
    },
    mounted () {
        bus.on('back-click', this.onBackClick);
    },

    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    },

    methods: {
        onBackClick () {
            this.$router.back();
        }
    }
};
</script>
