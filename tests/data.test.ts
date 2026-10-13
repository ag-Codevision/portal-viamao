import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCity,
  getProgram,
  listPrograms,
  listJobs,
  getLiveNow,
  getSchedule,
} from "../src/lib/data";
import { localTime } from "../src/lib/utils";
import { jobSubmissionSchema } from "../src/lib/validation/job";
test("território piloto e slugs desconhecidos", async () => {
  assert.equal(await getCity("porto-alegre"), null);
  assert.equal(await getProgram("nao-existe"), null);
  assert.equal((await listPrograms({ citySlug: "outra" })).length, 0);
});
test("busca normaliza acentos e compõe filtros", async () => {
  assert.equal(
    (await listPrograms({ query: "viamao", category: "Jornalismo" })).length,
    1,
  );
  assert.equal(
    (await listJobs({ query: "logistica", workMode: "Presencial" })).length,
    1,
  );
  assert.equal((await listJobs({ workMode: "Remoto" })).length, 0);
  assert.equal(
    (await listJobs({ publishedAfter: "2026-10-09T00:00:00Z" })).length,
    2,
  );
});
test("grade é demo e usa UTC/fuso local", async () => {
  const live = await getLiveNow();
  assert.equal(live.channel?.publicStatus, "demo");
  assert.equal(live.channel?.embedUrl, null);
  assert.equal(live.now?.label, "Viamão em pauta");
  assert.equal(localTime(live.now!.startsAt), "18:00");
  assert.equal((await getSchedule("invalid", "viamao")).length, 0);
});
test("formulário rejeita campos inválidos e exige confirmação", () => {
  assert.equal(jobSubmissionSchema.safeParse({}).success, false);
  const valid = {
    title: "Atendente de loja",
    company: "Empresa fictícia",
    email: "teste@example.com",
    description: "Descrição fictícia com requisitos suficientes para validar.",
    workMode: "Presencial",
    consent: true,
  };
  assert.equal(jobSubmissionSchema.safeParse(valid).success, true);
  assert.equal(
    jobSubmissionSchema.safeParse({ ...valid, consent: false }).success,
    false,
  );
  assert.equal(
    jobSubmissionSchema.safeParse({ ...valid, email: "invalido" }).success,
    false,
  );
});
