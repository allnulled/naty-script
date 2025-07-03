Vue.component("NatyScriptEditor", {
  name: "NatyScriptEditor",
  template: `
    <div class="">
      <div class="naty_script_editor_container">
        <div class="editor_title">
          <div class="flex_row centered pad_1">
            <div class="flex_100 pad_left_2">
              NatyScript online editor
            </div>
            <div class="flex_1 pad_left_1">
              <button class="button_to_compile" v-on:click="loadDoc">♻️</button>
            </div>
            <div class="flex_1 pad_left_1">
              <button class="button_to_compile" v-on:click="saveDoc">💾</button>
            </div>
            <div class="flex_1 pad_left_1">
              <button class="button_to_compile" v-on:click="goToGithub">🧭</button>
            </div>
            <div class="flex_1 pad_left_1">
              <button class="button_to_compile" v-on:click="validate">✅</button>
            </div>
            <div class="flex_1 pad_left_1">
              <button class="button_to_compile" v-on:click="compile">📸</button>
            </div>
          </div>
        </div>
        <div class="naty_script_editor">
          <div class="editor_for_input_container">
            <textarea
              class="editor_for_input"
              spellcheck="false"
              placeholder="Tu script > iría { aquí }."
              v-model="input"
              v-on:keypress.ctrl.enter="validate"></textarea>
          </div>
          <div class="payload_box">
            <div class="success_box" v-if="success" v-on:click="() => {success = false}">{{ success }}</div>
            <div class="error_box" v-if="error" v-on:click="() => error = false">{{ error }}</div>
            <div class="editor_for_output_container" v-if="output">
              <div class="flex_row centered">
                <div class="flex_100">
                  <button class="width_100" v-on:click="exportUrlInjection">📄 Copiar URL</button>
                </div>
                <div class="flex_1 pad_left_1">
                  <button class="width_100" v-on:click="() => {output = false}">❌</button>
                </div>
              </div>
              <textarea
                class="editor_for_output"
                spellcheck="false"
                v-model="output"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      input: "Carl > está { ok }.",
      output: "",
      error: false,
      success: false,
    };
  },
  methods: {
    getQueryParams(url = window.location.href) {
      const params = {};
      const urlObj = new URL(url);
      for (const [key, value] of urlObj.searchParams.entries()) {
        params[key] = value;
      }
      return params;
    },
    encodeQueryParams(obj = {}) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(obj)) {
        searchParams.append(key, value);
      }
      return searchParams.toString();
    },    
    loadUrlInjection() {
      const args = this.getQueryParams();
      if(args.code) {
        this.input = args.code;
      }
    },
    exportUrlInjection() {
      const urlParameters = this.encodeQueryParams({ code: this.input });
      window.navigator.clipboard.writeText(`https://allnulled.github.io/naty-script?${urlParameters}`);
    },
    compile() {
      try {
        const ast = NatyScriptParser.parse(this.input);
        this.output = JSON.stringify(ast, null, 2);
        this.success = "El script ha sido compilado a JSON correctamente";
      } catch (error) {
        this.error = error;
        this.success = false;
      }
    },
    validate() {
      try {
        NatyScriptParser.parse(this.input);
        this.error = false;
        this.success = "El script es válido";
      } catch (error) {
        this.error = error;
        this.success = false;
      }
    },
    goToGithub() {
      window.open("https://github.com/allnulled/naty-script", "_blank");
    },
    saveDoc() {
      localStorage.natyscript_unique_script = this.input;
    },
    loadDoc() {
      this.input = localStorage.natyscript_unique_script;
    },
  },
  mounted() {
    this.loadDoc();
    this.loadUrlInjection();
  }
});