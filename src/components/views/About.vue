<template>
  <div class="about-page container">
    <div class="jumbotron">
        <h1>
            Carpoolear
        </h1>
    </div>
    <p class="lead">Es un proyecto de <abbr title="Soluciones Tecnológicas Sustentables">STS</abbr> Rosario. El objetivo de STS Rosario en el que fundamentalmente se enmarca este proyecto es el de minimizar el impacto ambiental de nuestras actividades cotidianas.</p>
    <h2>Misión</h2>
    <p>El objetivo de Carpoolear es masificar la práctica de carpooling e incentivar el uso racional y eficiente del automóvil como modo de transporte. Con ello se busca lograr disminuir:</p>


    <ul class="list">

        <li>Las emisiones de gases causantes del aumento del efecto invernadero en nuestra atmósfera.</li>

        <li>El consumo de combustibles fósiles (recursos no renovables).</li>

        <li>Las congestiones de tránsito que ocasionan grandes pérdidas de tiempo.</li>

        <li>Los niveles de smog y ruido en las urbes, causantes de enfermedades.</li>

        <li>La probabilidad de accidentes de tránsito, con el consecuente descenso en la mortalidad.</li>

    </ul>



    <p>Para lograr esto, hemos desarrollado una aplicación gratuita en Facebook para que los usuarios publiquen sus viajes (tanto urbanos como interurbanos) y puedan ser contactados por otros usuarios que quieran realizar el mismo viaje. La idea es que las personas que usan su propio auto como modo de transporte, lo dejen en casa y se acoplen a los viajes de otras personas para aprovechar los lugares disponibles en su auto y compartir los gastos asociados al viaje.</p>



    <h2 id="carpoolearmas">Carpoolear para empresas</h2>

    <p>Como siguiente instancia, estaremos desarrollando un sistema de carpooling montado en una página web (por fuera de Facebook) para ofrecer este servicio a empresas e instituciones. El sistema sería cerrado de manera que los miembros de la empresa o institución puedan coordinar los viajes entre el lugar de trabajo y sus hogares.</p>

    <p>Si estás interesado en nuestra propuesta, <a href="https://carpoolearmas.com.ar">¡contactanos!</a></p>



    <h2>Impacto ambiental</h2>

    <p>Cada vez que dos automovilistas deciden compartir el viaje en un solo vehículo, se evitan – en promedio, por kilómetro recorrido – la emisión de 150 gr de CO<sub>2</sub> a la atmósfera, uno de los principales gases que contribuyen al efecto invernadero, y el consumo de 0,071 litros de nafta, fuente de energía no renovable y que por ello debe utilizarse de forma racional.</p>



    <h2>Premios</h2>

    <ul class="list">

        <li>Ashoka - “Avancemos” (2011 y 2012)</li>

        <li>Gobierno de la Provincia de Santa Fe - “Ingenia 3” (2012)</li>

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
    @media (max-width: 768px) {
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
export default {
    name: 'about',
    data () {
        return {
        };
    }
};
</script>
