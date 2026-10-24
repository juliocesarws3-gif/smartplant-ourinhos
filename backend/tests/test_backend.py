from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Online"
    assert "SmartPlant Ourinhos" in data["sistema"]

def test_kpis():
    response = client.get("/api/sensors/kpis")
    assert response.status_code == 200
    data = response.json()
    assert "avg_oee" in data
    assert data["total_leituras"] == 1200

def test_machines():
    response = client.get("/api/sensors/machines")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "maquina_id" in data[0]

def test_scatter():
    response = client.get("/api/sensors/scatter")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_os_flow():
    # Listar OS
    res_list = client.get("/api/os")
    assert res_list.status_code == 200
    initial_count = len(res_list.json())

    # Criar nova OS
    new_os = {
        "maquina_id": "EQP-0147",
        "titulo": "Teste Automatizado de OS",
        "descricao": "Verificação de pipeline de teste",
        "componente_critico": "Sensor de Pressão",
        "prioridade": "Alta",
        "tecnico_responsavel": "Tester Pytest",
        "custo_estimado": 150.0
    }
    res_create = client.post("/api/os", json=new_os)
    assert res_create.status_code == 200
    created = res_create.json()
    assert created["status"] == "ABERTA"

    # Atualizar OS
    res_update = client.patch(f"/api/os/{created['id']}", json={"status": "EM_ANDAMENTO"})
    assert res_update.status_code == 200
    assert res_update.json()["status"] == "EM_ANDAMENTO"
