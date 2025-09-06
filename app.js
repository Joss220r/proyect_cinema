const { createApp } = Vue;

createApp({
  data() {
    return {
      API: 'https://movie.azurewebsites.net/api/cartelera',
      todas: [],
      peliculas: [],
      cargando: false,
      error: '',
      filtros: {
        title: '',
        ubication: '',
        type: '',
        onlyActive: false,
        sort: 'desc',
      },
      opciones: { ubications: [], types: [] },
      pagina: 1,
      porPagina: 12,
      seleccionado: null,
      admin: {
        create: {
          imdbID: '',
          Title: '',
          Year: '',
          Type: '',
          Poster: '',
          Estado: true,
          description: '',
          Ubication: '',
        },
        update: {
          imdbID: '',
          Title: '',
          Year: '',
          Type: '',
          Poster: '',
          Estado: true,
          description: '',
          Ubication: '',
        },
        toDelete: '',
      },
      debounceTimeout: null,
    };
  },
  computed: {
    procesadas() {
      let arr = [...this.peliculas];
      if (this.filtros.type)
        arr = arr.filter((m) => (m.Type || '') === this.filtros.type);
      if (this.filtros.onlyActive) arr = arr.filter((m) => !!m.Estado);
      arr.sort((a, b) => {
        const ay = parseInt(
          (a.Year || '').toString().match(/\d{4}/)?.[0] || '0',
          10
        );
        const by = parseInt(
          (b.Year || '').toString().match(/\d{4}/)?.[0] || '0',
          10
        );
        return this.filtros.sort === 'asc' ? ay - by : by - ay;
      });
      return arr;
    },
    totalEncontradas() {
      return this.peliculas.length;
    },
    totalPaginas() {
      return Math.max(1, Math.ceil(this.procesadas.length / this.porPagina));
    },
    paginadas() {
      const ini = (this.pagina - 1) * this.porPagina;
      return this.procesadas.slice(ini, ini + this.porPagina);
    },
  },
  methods: {
    async init() {
      await this.cargarOpciones();
      await this.buscarServidor();
    },
    async cargarOpciones() {
      this.cargando = true;
      this.error = '';
      try {
        const res = await fetch(`${this.API}?title=&ubication=`);
        if (!res.ok) throw new Error('No se pudo cargar la lista completa');
        this.todas = await res.json();
        const setU = new Set(),
          setT = new Set();
        this.todas.forEach((m) => {
          if (m.Ubication) setU.add(m.Ubication);
          if (m.Type) setT.add(m.Type);
        });
        this.opciones.ubications = Array.from(setU).sort();
        this.opciones.types = Array.from(setT).sort();
      } catch (e) {
        this.error = e.message || 'Error cargando opciones';
      } finally {
        this.cargando = false;
      }
    },
    async buscarServidor() {
      this.cargando = true;
      this.error = '';
      this.pagina = 1;
      try {
        const t = encodeURIComponent(this.filtros.title || '');
        const u = encodeURIComponent(this.filtros.ubication || '');
        const res = await fetch(`${this.API}?title=${t}&ubication=${u}`);
        if (!res.ok) throw new Error('Error consultando la API');
        this.peliculas = await res.json();
      } catch (e) {
        this.error = e.message || 'Error en la búsqueda';
      } finally {
        this.cargando = false;
      }
    },
    refrescar() {
      this.buscarServidor();
    },
    limpiarFiltros() {
      this.filtros = { title:'', ubication:'', type:'', onlyActive:false, sort:'desc' };
      this.buscarServidor();
    },
    debouncedBuscarServidor() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.buscarServidor();
      }, 500); // 500ms delay
    },
    abrirModal(m) {
      this.seleccionado = m;
      const modal = new bootstrap.Modal(
        document.getElementById('detalleModal')
      );
      modal.show();
    },

    // ---- CRUD (opcional) ----
    async crear() {
      try {
        const res = await fetch(this.API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.admin.create),
        });
        alert(res.ok ? 'Creado correctamente' : 'No se pudo crear');
        if (res.ok) this.buscarServidor();
      } catch {
        alert('Error POST');
      }
    },
    async actualizar() {
      if (!this.admin.update.imdbID) return alert('Coloca imdbID');
      try {
        const url = `${this.API}?imdbID=${encodeURIComponent(this.admin.update.imdbID)}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.admin.update),
        });
        alert(res.ok ? 'Actualizado correctamente' : 'No se pudo actualizar');
        if (res.ok) this.buscarServidor();
      } catch {
        alert('Error PUT');
      }
    },
    async eliminar() {
      if (!this.admin.toDelete) return alert('Coloca imdbID a borrar');
      if (!confirm('¿Eliminar definitivamente?')) return;
      try {
        const url = `${this.API}?imdbID=${encodeURIComponent(this.admin.toDelete)}`;
        const res = await fetch(url, { method: 'DELETE' });
        alert(res.ok ? 'Eliminado' : 'No se pudo eliminar');
        if (res.ok) this.buscarServidor();
      } catch {
        alert('Error DELETE');
      }
    },
  },
  mounted() {
    this.init();
  },
}).mount('#app');
