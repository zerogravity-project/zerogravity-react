'use client';

import React, { useState } from 'react';

import {
  ActionButton,
  LinkButton,
  TitleText,
  ContentText,
  Button,
  HeadlineText,
  TextInput,
  TextArea,
  RadioButton,
  RadioButtonGroup,
  LogoSvg,
} from '@/app/_components/ui';

export default function TestPage() {
  // State for form inputs
  const [textInputValue, setTextInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [selectedRadio, setSelectedRadio] = useState('');
  const [selectedColorRadio, setSelectedColorRadio] = useState('');

  // Radio button options
  const fontOptions = [
    { index: 0, selection: 'Arial' },
    { index: 1, selection: 'Georgia' },
    { index: 2, selection: 'Helvetica' },
  ];

  const colorOptions = [
    { index: 0, selection: '#ff6b6b', color: '#ff6b6b' },
    { index: 1, selection: '#4ecdc4', color: '#4ecdc4' },
    { index: 2, selection: '#45b7d1', color: '#45b7d1' },
    { index: 3, selection: '#f9ca24', color: '#f9ca24' },
  ];

  const handleActionClick = (type: string) => {
    alert(`${type} 버튼이 클릭되었습니다!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center">
          <LogoSvg width={120} height={40} className="mx-auto mb-4" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">컴포넌트 테스트 페이지</h1>
          <p className="text-gray-600">Vue에서 React로 이관된 모든 컴포넌트들을 테스트해보세요</p>
        </div>

        {/* Text Components */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">📝 Text 컴포넌트</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">TitleText</h3>
              <TitleText titleText="메인 제목입니다" subTitleText="서브 제목도 함께 표시됩니다" size="l" />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">ContentText</h3>
              <ContentText
                text="이것은 본문 텍스트입니다.\n줄바꿈도 지원합니다.\n여러 줄의 텍스트를 표시할 수 있어요."
                align="left"
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">HeadlineText</h3>
              <HeadlineText
                text="헤드라인 제목과 버튼이 포함된 컴포넌트입니다"
                buttons={[{ text: '메인 버튼', variant: 'main', onClick: () => handleActionClick('헤드라인') }]}
                links={[{ text: '링크 버튼', linkPath: '/test', isActive: true }]}
              />
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">🔘 Button 컴포넌트</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">ActionButton</h3>
              <div className="flex flex-wrap gap-4">
                <ActionButton
                  variant="main"
                  tone="primary"
                  text="메인 버튼"
                  onClick={() => handleActionClick('메인')}
                />
                <ActionButton
                  variant="sub"
                  tone="secondary"
                  text="서브 버튼"
                  onClick={() => handleActionClick('서브')}
                />
                <ActionButton
                  variant="round"
                  tone="tertiary"
                  text="라운드 버튼"
                  onClick={() => handleActionClick('라운드')}
                />
                <ActionButton
                  variant="kakao"
                  tone="primary"
                  text="카카오 로그인"
                  onClick={() => handleActionClick('카카오')}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">LinkButton</h3>
              <div className="flex flex-wrap gap-4">
                <LinkButton text="활성 링크" linkPath="/test" isActive={true} />
                <LinkButton text="비활성 링크" linkPath="/test" isActive={false} />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">New Button Component (Figma 디자인 기반)</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-600">기본 변형</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" size="sm">
                      Primary Small
                    </Button>
                    <Button variant="primary" size="md">
                      Primary Medium
                    </Button>
                    <Button variant="primary" size="lg">
                      Primary Large
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-600">다양한 변형</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="kakao">Kakao Login</Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-600">아이콘 포함</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" leftIcon={<span className="material-symbols-outlined">add</span>}>
                      Left Icon
                    </Button>
                    <Button
                      variant="secondary"
                      rightIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                    >
                      Right Icon
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={<span className="material-symbols-outlined">download</span>}
                      rightIcon={<span className="material-symbols-outlined">open_in_new</span>}
                    >
                      Both Icons
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-600">상태</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" loading>
                      Loading...
                    </Button>
                    <Button variant="secondary" disabled>
                      Disabled
                    </Button>
                    <Button variant="primary" fullWidth>
                      Full Width Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Input Components */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">📝 Input 컴포넌트</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">TextInput</h3>
              <div className="space-y-4">
                <TextInput
                  label="일반 입력"
                  placeholder="텍스트를 입력하세요"
                  value={textInputValue}
                  onChange={setTextInputValue}
                />
                <TextInput label="읽기 전용" value="수정할 수 없는 텍스트" readonly={true} />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">TextArea</h3>
              <TextArea
                placeholder="여러 줄의 텍스트를 입력하세요..."
                value={textAreaValue}
                onChange={setTextAreaValue}
                maxLength={200}
              />
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">RadioButton (Font)</h3>
              <RadioButtonGroup
                variant="font"
                name="fonts"
                options={fontOptions}
                selectedValue={selectedRadio}
                onChange={setSelectedRadio}
              />
              <p className="mt-2 text-sm text-gray-600">선택된 값: {selectedRadio}</p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">RadioButton (Color)</h3>
              <RadioButtonGroup
                variant="color"
                name="colors"
                options={colorOptions}
                selectedValue={selectedColorRadio}
                onChange={setSelectedColorRadio}
              />
              <p className="mt-2 text-sm text-gray-600">선택된 색상: {selectedColorRadio}</p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium">개별 RadioButton</h3>
              <div className="flex gap-4">
                <RadioButton
                  variant="range"
                  name="range-test"
                  index={0}
                  selection="option1"
                  color="#ff6b6b"
                  isChecked={false}
                  onChange={value => console.log('Range selected:', value)}
                />
                <RadioButton
                  variant="range"
                  name="range-test"
                  index={1}
                  selection="option2"
                  color="#4ecdc4"
                  isChecked={true}
                  onChange={value => console.log('Range selected:', value)}
                />
                <RadioButton
                  variant="object"
                  name="object-test"
                  index={0}
                  selection="object1"
                  isChecked={false}
                  onChange={value => console.log('Object selected:', value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Logo Component */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">🎨 Logo 컴포넌트</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-lg font-medium">다양한 크기의 LogoSvg</h3>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <LogoSvg width={68} height={20} />
                  <p className="mt-1 text-xs text-gray-500">기본 (68x20)</p>
                </div>
                <div className="text-center">
                  <LogoSvg width={136} height={40} />
                  <p className="mt-1 text-xs text-gray-500">중간 (136x40)</p>
                </div>
                <div className="text-center">
                  <LogoSvg width={204} height={60} />
                  <p className="mt-1 text-xs text-gray-500">큰 (204x60)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Summary */}
        <section className="rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="mb-4 text-2xl font-semibold text-green-800">✅ 이관 완료 상태</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4">
              <h3 className="font-semibold text-green-700">Button</h3>
              <p className="text-sm text-gray-600">ActionButton, LinkButton</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h3 className="font-semibold text-green-700">Text</h3>
              <p className="text-sm text-gray-600">TitleText, ContentText, HeadlineText</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h3 className="font-semibold text-green-700">Input</h3>
              <p className="text-sm text-gray-600">TextInput, TextArea, RadioButton</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h3 className="font-semibold text-green-700">Others</h3>
              <p className="text-sm text-gray-600">LogoSvg</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
