<script>
import { Line, mixins } from "vue-chartjs";
import  'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend:{
          labels:{
            fontSize: 25
          }
        },
        plugins: {
            colorschemes: {
                scheme: 'tableau.Gray20'//https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html
            }
        }
      },
    };
  },
  async mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>